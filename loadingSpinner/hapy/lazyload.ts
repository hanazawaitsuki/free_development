class LazyLoad {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(this.onIntersection, {
      root: null, // ビューポートを基準に監視
      rootMargin: "0px",
      threshold: 0.1, // 10% 以上表示されたらロード
    });
    console.log(this.observer)
    this.observeImages();
  }

  private observeImages(): void {
    const images = document.querySelectorAll("img.lazy");
    images.forEach((img) => this.observer.observe(img));
  }

  private onIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || "";
        img.classList.add("lazyloaded");
        this.observer.unobserve(img); // 一度ロードしたら監視を解除
      }
    });
  }
}

// LazyLoad を初期化
document.addEventListener("DOMContentLoaded", () => new LazyLoad());