<template>
  <div class="tree-parent">
    <q-input
      v-model="filter"
      class="input"
      color="positive"
    >
      <template v-slot:prepend>
        <q-icon
          name="mdi-magnify"
          class="input__icon"
        />
      </template>
    </q-input>
    <q-tree
      :nodes="treeNodes"
      :selected="selectedSubject"
      :filter="filter"
      :filter-method="filterNodes"
      @update:selected="selectNode($event)"
      class="tree"
      node-key="label"
      ref="tree"
    >
    <template v-slot:default-header="prop">
      <Menu :menu-items="createMenuItems(prop.node)" />
      <div :class="prop.node.style">
        {{ prop.key }}
      </div>
    </template>
    </q-tree>
  </div>
</template>

<script>
import DatabaseApi, { SUBJECTS, SUBJECTS_PRIMARY_KEY } from 'components/utils/databaseApi';
import KeyListener, { CTRL_S_KEY } from 'components/utils/keyListener';
import TreeNode from 'components/models/treeNode';
import MenuItem from 'components/models/menuItem';
import Menu from 'components/Menu';

export default {
  name: 'LessonTree',

  data() {
    return {
      db: null,
      keyListener: null,
      lessonId: null,
      selectedSubject: null,
      previousSelectedSubject: null,
      filter: '',
      treeNodes: [],
    };
  },

  created() {
    this.db = new DatabaseApi(SUBJECTS, SUBJECTS_PRIMARY_KEY);
    this.keyListener = new KeyListener();
    this.lessonId = this.$route.params.lessonId;

    this.initializeSubjects();
  },

  mounted() {
    this.keyListener.addKeyListener(CTRL_S_KEY, this.createSubject, this);
  },

  beforeDestroy() {
    this.keyListener.destroyKeyListener();
  },

  methods: {
    initializeSubjects() {
      this.db.findDoc(this.lessonId).then((doc) => {
        if (doc === null) {
          this.db.insertDoc({
            lessonId: this.lessonId,
            subjects: [],
          });
        } else {
          Object.keys(doc.subjects).forEach((key) => {
            const subject = doc.subjects[key];

            if (subject !== undefined) {
              this.$set(this.treeNodes, key, new TreeNode(subject.subjectTitle, key, subject.content));
            }
          });
        }
      });
    },

    createSubject() {
      this.showDialog('Enter the title of subject', (inputValue) => {
        if (this.isNodeUnique(inputValue)) {
          this.db.updateDoc(this.lessonId, {
            $push: {
              subjects: {
                subjectTitle: inputValue,
                content: '',
              },
            },
          });
          const subjectKey = this.getUniqueKey(this.treeNodes);

          this.$set(this.treeNodes, subjectKey, new TreeNode(inputValue, subjectKey));
        }
      });
    },

    renameSubject(node) {
      this.showDialog('Rename the subject', (inputValue) => {
        if (this.isNodeUnique(inputValue)) {
          this.db.atomicUpdate(this.lessonId, (oldData) => {
            oldData.subjects[node.id].subjectTitle = inputValue;
            node.label = inputValue;

            return oldData;
          });
        }
      });
    },

    deleteSubject(node) {
      this.$store.dispatch('editorStore/resetSelectedSubject');
      this.db.atomicUpdate(this.lessonId, (oldData) => {
        delete oldData.subjects[node.id];
        this.$delete(this.treeNodes, node.id);

        return oldData;
      });
    },

    selectNode(nodeKey) {
      if (nodeKey !== null) {
        const subject = this.$refs.tree.getNodeByKey(nodeKey);

        this.$store.dispatch('editorStore/setSelectedSubject', subject);
        this.$store.dispatch('editorStore/selectSubject', { subject, select: true });
      }
    },

    filterNodes(node, filter) {
      return node.label && node.label.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    },

    createMenuItems(node) {
      return [
        new MenuItem('Rename', this.renameSubject, [node]),
        new MenuItem('Delete', this.deleteSubject, [node]),
      ];
    },

    showDialog(title, onOkFn) {
      this.$q.dialog({
        title,
        class: 'dialog',
        color: 'positive',
        prompt: {
          rounded: true,
          model: '',
          isValid: (inputValue) => inputValue.length > 0,
          type: 'text',
        },
        cancel: true,
      }).onOk(onOkFn);
    },

    getUniqueKey(array) {
      if (array.length === 0) {
        return 0;
      }

      return Math.max(...Object.keys(array).map((key) => Number.parseInt(key, 10))) + 1;
    },

    isNodeUnique(nodeLabel) {
      return this.treeNodes.every((treeNode) => treeNode.label !== nodeLabel);
    },
  },

  components: { Menu },
};
</script>

<style lang="scss">
.tree-parent {
  width: 300px;
  height: 100%;
  background-color: #464646;
}

.tree {
  height: calc(100% - 107px);
  font-size: 0;
}

.subject-node {
  font-size: 22px;
  font-weight: bold;
  color: #B3B8BC;
  user-select: none;
}

.selected-node {
  @extend .subject-node;
  color: #52D273;
}

.dialog {
  text-align: center;
  background-color: #333333;
  color: #52D273;
}

.input input {
  text-align: left;
  padding: 0;
}

.input__icon {
  padding-left: 5px;
  color: #52D273;
}
</style>
