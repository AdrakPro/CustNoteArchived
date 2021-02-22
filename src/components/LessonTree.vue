<template>
  <div class="tree-parent">
    <q-input
      v-model="filter"
      class="input"
      color="positive"
    >
      <template v-slot:prepend>
        <q-icon
          name="search"
          class="input__icon"
        />
      </template>
    </q-input>
    <q-tree
      :nodes="treeNodes"
      :selected="selectedNodeTitle"
      :filter="filter"
      :filter-method="filterNodes"
      @update:selected="selectNode($event)"
      @lazy-load="onLazyLoad"
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
import DatabaseApi, { MODULES, MODULES_PRIMARY_KEY } from 'components/utils/databaseApi';
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
      selectedNodeTitle: null,
      filter: '',
      treeNodes: [],
    };
  },

  created() {
    this.db = new DatabaseApi(MODULES, MODULES_PRIMARY_KEY);
    this.keyListener = new KeyListener();
    this.lessonId = this.$route.params.lessonId;

    this.initializeModules();
  },

  mounted() {
    this.keyListener.addKeyListener(CTRL_S_KEY, this.createModule, this);
  },

  beforeDestroy() {
    this.keyListener.destroyKeyListener();
  },

  methods: {
    initializeModules() {
      this.db.findDoc(this.lessonId)
        .then((doc) => {
          if (doc === null) {
            this.db.insertDoc({
              lessonId: this.lessonId,
              modules: [],
            });
          } else {
            Object.keys(doc.modules)
              .forEach((key) => {
                const module = doc.modules[key];

                if (module !== undefined) {
                  this.$set(this.treeNodes, key, new TreeNode(module.moduleTitle, key));
                }
              });
          }
        });
    },

    createModule() {
      this.showDialog('Enter the title of module', (inputValue) => {
        if (this.isNodeUnique(inputValue)) {
          this.db.updateDoc(this.lessonId, {
            $push: {
              modules: {
                moduleTitle: inputValue,
                subjects: [],
              },
            },
          });
          const moduleKey = this.getUniqueKey(this.treeNodes);

          this.$set(this.treeNodes, moduleKey, new TreeNode(inputValue, moduleKey));
        }
      });
    },

    renameModule(node) {
      this.showDialog('Rename the module', (inputValue) => {
        if (this.isNodeUnique(inputValue)) {
          this.db.atomicUpdate(this.lessonId, (oldData) => {
            oldData.modules[node.id].moduleTitle = inputValue;
            node.label = inputValue;

            return oldData;
          });
        }
      });
    },

    deleteModule(node) {
      this.db.atomicUpdate(this.lessonId, (oldData) => {
        delete oldData.modules[node.id];
        this.$delete(this.treeNodes, node.id);

        return oldData;
      });
    },

    createSubject(node) {
      this.showDialog('Enter the title of subject', (inputValue) => {
        if (this.isNodeUnique(inputValue, node.children)) {
          this.db.atomicUpdate(this.lessonId, (oldData) => {
            const { subjects } = oldData.modules[node.id];
            const subjectKey = this.getUniqueKey(subjects);

            subjects[subjectKey] = {
              subjectTitle: inputValue,
              content: '',
            };
            this.$set(this.treeNodes[node.id].children, subjectKey, new TreeNode(inputValue, subjectKey, node.id, 'subject'));

            return oldData;
          });
        }
      });
    },

    renameSubject(node) {
      this.showDialog('Rename the subject', (inputValue) => {
        if (this.isNodeUnique(inputValue, this.treeNodes[node.parentId].children)) {
          this.db.atomicUpdate(this.lessonId, (oldData) => {
            oldData.modules[node.parentId].subjects[node.id].subjectTitle = inputValue;
            node.label = inputValue;

            return oldData;
          });
        }
      });
    },

    deleteSubject(node) {
      this.db.atomicUpdate(this.lessonId, (oldData) => {
        delete oldData.modules[node.parentId].subjects[node.id];
        this.$delete(this.treeNodes[node.parentId].children, node.id);

        return oldData;
      });
    },

    selectNode(nodeLabel) {
      if (nodeLabel !== null) {
        this.selectedNodeTitle = nodeLabel;
      }
    },

    // temporary; looking for filter with child
    filterNodes(node, filter) {
      return node.label && node.label.toLowerCase().indexOf(filter) > -1;
    },

    onLazyLoad({ node, done }) {
      this.db.findDoc(this.lessonId).then((doc) => {
        const module = doc.modules[node.id];

        if (module.subjects === undefined) {
          done([]);
          return;
        }
        const subSubjects = [];

        Object.keys(module.subjects).forEach((subjectKey) => {
          const subject = module.subjects[subjectKey];

          if (subject !== undefined) {
            this.$set(subSubjects, subjectKey, new TreeNode(subject.subjectTitle, subjectKey, node.id, 'subject'));
          }
        });
        done(subSubjects);
      });
    },

    createMenuItems(node) {
      if (node.style === 'module-node') {
        return [
          new MenuItem('Create subject', this.createSubject, [node]),
          new MenuItem('Rename', this.renameModule, [node]),
          new MenuItem('Delete', this.deleteModule, [node]),
        ];
      }
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

    isNodeUnique(nodeLabel, childArray = null) {
      const isNodeUnique = (array) => array.every((treeNode) => treeNode.label !== nodeLabel);

      if (childArray === null || childArray.length === 0) {
        return isNodeUnique(this.treeNodes);
      }

      return isNodeUnique(this.treeNodes) && isNodeUnique(childArray);
    },
  },

  components: { Menu },
};
</script>

<style>
.tree-parent {
  width: 300px;
  height: calc(100vh - 51px);
  background-color: #464646;
  box-shadow: 1px 0 9px 0 #333333;
}

.tree {
  height: 100%;
  font-size: 0;
  padding-top: 5px;
}

.module-node {
  font-size: 22px;
  font-weight: bold;
  color: #52D273;
  user-select: none;
}

.subject-node {
  font-size: 20px;
  color: #B3B8BC;
  user-select: none;
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
