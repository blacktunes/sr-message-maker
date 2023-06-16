import mitt from 'mitt'

type Events = {
  screenshot: void
  autoplay: void
}

export const emitter = mitt<Events>()
