export const qiniuStyles = `
.qiniu-settings { display: grid; gap: 1rem; max-width: 70rem; }
.qiniu-model-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: .75rem; }
.qiniu-model-card, .qiniu-api-keys article { border: 1px solid var(--dsh-color-border, #d9d9d9); padding: .875rem; border-radius: 6px; }
.qiniu-badges { display: flex; flex-wrap: wrap; gap: .35rem; }
.qiniu-badges span { background: var(--dsh-color-surface-raised, #f3f3f3); padding: .2rem .4rem; }
@media (max-width: 640px) { .qiniu-settings { padding: .75rem; } }
`
