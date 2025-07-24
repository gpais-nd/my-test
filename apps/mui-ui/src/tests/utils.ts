interface ScreenSize {
  height: number;
  width: number;
}

export const mockResizeObserver = ({ height, width }: ScreenSize) => {
  class MockResizeObserver {
    callback: ResizeObserverCallback;
    observations: Element[];

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
      this.observations = [];
    }

    observe(target: Element): void {
      this.observations.push(target);
      this.callback(
        [
          {
            target,
            contentRect: {
              bottom: 0,
              height,
              left: 0,
              right: 0,
              top: 0,
              width,
              x: 0,
              y: 0,
              toJSON: () => {},
            } as DOMRectReadOnly,
            borderBoxSize: [
              {
                inlineSize: 0,
                blockSize: 0,
              },
            ],
            contentBoxSize: [
              {
                inlineSize: 0,
                blockSize: 0,
              },
            ],
            devicePixelContentBoxSize: [
              {
                inlineSize: 0,
                blockSize: 0,
              },
            ],
          },
        ],
        this
      );
    }

    unobserve(target: Element): void {
      this.observations = this.observations.filter(
        observation => observation !== target
      );
    }

    disconnect(): void {
      this.observations = [];
    }
  }

  window.ResizeObserver =
    MockResizeObserver as unknown as typeof ResizeObserver;
};
