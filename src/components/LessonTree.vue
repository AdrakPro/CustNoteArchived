<template>
  <div class="tree-parent">
    <q-input
      v-model="searchInput"
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
      :filter="searchInput"
      :filter-method="searchNodes"
      @update:selected="selectSubject($event)"
      class="tree"
      node-key="label"
      ref="tree"
    >
    <template v-slot:default-header="prop">
      <div :class="prop.node.style">
        {{ prop.key }}
      </div>
      <Menu :menu-items="menuItems(prop.node)" />
    </template>
    </q-tree>
  </div>
</template>

<script>
import { DatabaseApi, SUBJECTS, SUBJECTS_PRIMARY_KEY } from 'components/utils/databaseApi';
import { KeyListener, CTRL_S } from 'components/utils/keyListener';
import TreeNode from 'components/models/treeNode';
import MenuItem from 'components/models/menuItem';
import Menu from 'components/Menu';

export default {
  name: 'LessonTree',

  data() {
    return {
      selectedSubject: null,
      searchInput: '',
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
    this.keyListener.addKeyListener(CTRL_S, this.createSubject, this);
  },

  beforeDestroy() {
    this.keyListener.destroyKeyListener();
  },

  methods: {
    setSubject(key, title, content = '') {
      this.$set(this.treeNodes, key, new TreeNode(title, key, content));
    },

    fetchSubjects(doc) {
      Object.keys(doc.subjects).forEach((key) => {
        const subject = doc.subjects[key];

        if (subject !== null) {
          const { title, content } = subject;

          this.setSubject(key, title, content);
        }
      });
    },

    initializeSubjects() {
      this.db.findDoc(this.lessonId).then((doc) => {
        if (doc !== null) {
          this.fetchSubjects(doc);
        } else {
          this.db.insertDoc({
            lessonId: this.lessonId,
            subjects: [],
          });
        }
      });
    },

    createSubject() {
      this.showDialog('Enter the title of subject', (title) => {
        if (this.isNodeUnique(title)) {
          this.db.updateDoc(this.lessonId, {
            $push: {
              subjects: {
                title,
                content: '',
              },
            },
          });
          const subjectKey = this.createUniqueKey(this.treeNodes);

          this.setSubject(subjectKey, title);
        }
      });
    },

    renameSubject(node) {
      this.showDialog('Rename the subject', (inputValue) => {
        if (this.isNodeUnique(inputValue)) {
          this.db.atomicUpdate(this.lessonId, (oldData) => {
            oldData.subjects[node.id].title = inputValue;

            return oldData;
          }).then(() => {
            node.label = inputValue;
          });
        }
      });
    },

    deleteSubject(node) {
      this.db.atomicUpdate(this.lessonId, (oldData) => {
        oldData.subjects[node.id] = null;

        return oldData;
      }).then(() => {
        this.$delete(this.treeNodes, node.id);
        this.resetSubjectSelection();
      });
    },

    selectSubject(nodeKey) {
      const subject = this.$refs.tree.getNodeByKey(nodeKey);

      this.$store.dispatch('editorStore/setSelectedSubject', subject);
      this.$store.dispatch('editorStore/selectSubject', { subject, select: true });
    },

    showDialog(title, callback) {
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
      }).onOk(callback);
    },

    searchNodes(node, filter) {
      return node.label && node.label.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    },

    menuItems(node) {
      return [
        new MenuItem('Rename', this.renameSubject, [node]),
        new MenuItem('Delete', this.deleteSubject, [node]),
      ];
    },

    createUniqueKey(array) {
      return array.length === 0 ? 0
        : Math.max(...Object.keys(array).map((key) => Number.parseInt(key, 10))) + 1;
    },

    isNodeUnique(nodeLabel) {
      return this.treeNodes.every((treeNode) => treeNode.label !== nodeLabel);
    },

    resetSubjectSelection() {
      this.$store.dispatch('editorStore/resetSelectedSubject');
    },
  },

  components: { Menu },
};
</script>

<style lang="scss" scoped>
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
  color: $positive;
}

.input input {
  text-align: left;
  padding: 0;
}

.input__icon {
  padding-left: 5px;
  color: $positive;
}
</style>
