export default {
    props: {
        context: Object,
    },
    data() {
        return {
            tasks: [],
            currentTaskId: String,
            selectFlag: false,
            quantity: 1,
            isDrawerVisible: false,
            value1: 0,
            loras: [
                {
                    id: 1,
                    modelName: "场景1",
                    weight: 1.0,
                    modelImage: "https://ai-image.weshop.com/403df960-8ac8-47c1-bdff-3e90681d855f_1024x1024.png_256x256.jpeg",
                },
                {
                    id: 2,
                    modelName: "场景2",
                    weight: 1.0,
                    modelImage: "https://ai-image.weshop.com/2bc446c7-3283-41cb-b5e2-6b2fbae36680.png_256x256.jpeg",
                },
            ],
            loraIndex: null,
            sizes: [
                { label: "1024:1024"},
                { label: "1024:2048"},
                { label: "2048:2048"},
                { label: "512:512"},
            ],
            selectedSize: null,
        };
    },
    computed: {
        currentTask() {
            return this.tasks.find(task => task.id === this.currentTaskId) || {};
        },
    },
    methods: {
        async addTask() {
            const newTaskId = Date.now();
            const newTask = {
                id: newTaskId,
                checkpoint: "",
                vae: "",
                clipSkip: "1",
                prompt: "",
                negativePrompt: "",
                showOptions: false,
            };
            // const res = await save({ type: 1, name: "任务-" + newTaskId })
            // newTask.id = res.msg;
            this.tasks.unshift(newTask)
            this.currentTaskId = newTask.id;
            this.isDrawerVisible = true;
        },
        openDrawer(taskId) {
            this.currentTaskId = taskId;
            this.isDrawerVisible = true;
        },
        toggleOptions() {
            this.currentTask.showOptions = !this.currentTask.showOptions;
        },
        handleClick(id) {
            if (this.loraIndex === id) {
                this.loraIndex = null;
            } else {
                this.loraIndex = id;
            }
        },
        increment(lora) {
            if (lora.weight < 1) {
                lora.weight = Math.max(parseFloat((lora.weight + 0.1).toFixed(1)), 0);
            }
        },
        decrement(lora) {
            if (lora.weight > 0) {
                lora.weight = Math.max(parseFloat((lora.weight - 0.1).toFixed(1)), 0);
            }
        },
        selectNum(num) {
            this.quantity = num
        },
        openSelectFlag() {
            this.selectFlag = !this.selectFlag
        },
        handleDrawerClose() {
            this.isDrawerVisible = false;
            this.currentTaskId = null;
        },
        txt2img() {

        },
    },
};