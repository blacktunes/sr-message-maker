let confirm = () => {}
export const callback = {
  set confirm(fn: () => any) {
    confirm = fn
  },
  get confirm() {
    return () => {
      confirm()
    }
  }
}
