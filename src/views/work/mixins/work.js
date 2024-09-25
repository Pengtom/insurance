export default {
    data() {
        return {
            flag: true,
            images: [],
            hasMore: true,
            isSuccess: false,
            currentTask: {}
        }
    },
    methods: {
        handleOpen(newdata) {
            this.flag = !newdata;
        },
        handleOpenSuccess(newdata) {
            this.currentTask = newdata
            this.isSuccess = newdata.isSuccess;
        },
        handleUpdateStatus() {
            this.$refs.leftComponent.init();
        }
    },
}