/**
 * 通用确认弹窗组件
 * 用于替换分散的确认弹窗 UI
 */
Component({
    properties: {
        // 是否显示
        show: {
            type: Boolean,
            value: false
        },
        // 标题
        title: {
            type: String,
            value: '确认'
        },
        // 描述内容
        content: {
            type: String,
            value: ''
        },
        // 确认按钮文字
        confirmText: {
            type: String,
            value: '确定'
        },
        // 取消按钮文字
        cancelText: {
            type: String,
            value: '取消'
        },
        // 确认按钮是否为危险样式
        confirmDanger: {
            type: Boolean,
            value: false
        }
    },

    methods: {
        // 点击遮罩层
        onMaskTap() {
            this.triggerEvent('cancel');
        },

        // 阻止冒泡
        preventBubble() { },

        // 取消
        onCancel() {
            this.triggerEvent('cancel');
        },

        // 确认
        onConfirm() {
            this.triggerEvent('confirm');
        }
    }
});
