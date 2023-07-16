import mitt from 'mitt'

type Events = {
  screenshot: void
  autoplay: void
  stopplay: void
}

export const emitter = mitt<Events>()
