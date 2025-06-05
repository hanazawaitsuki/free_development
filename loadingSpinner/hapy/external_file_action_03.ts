/*
    Copilotに書かせてみた
*/ 
class LazyLoader {
    private loadingElement: HTMLElement;
    private contentElement: HTMLElement;
    
    constructor() {
        this.loadingElement = document.getElementById("loading")!;
        this.contentElement = document.getElementById("content")!;
        this.init();
    }

    private async init(): Promise<void> {
        try {
            // 外部ファイルを非同期でロード（例: API からデータ取得）
            await this.loadExternalFile();
            
            // 読み込み完了後、ローディングモジュールを削除しコンテンツを表示
            this.loadingElement.style.display = "none";
            this.contentElement.style.display = "block";

            console.log("コンテンツの表示完了");
        } catch (error) {
            console.error("外部ファイルの読み込みに失敗しました:", error);
        }
    }

    private loadExternalFile(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("外部ファイルの読み込み完了");
                resolve();
            }, 3000); // 例: 3秒間遅延（擬似的な遅延処理）
        });
    }
}

// `DOMContentLoaded` が完了したら LazyLoader を実行
document.addEventListener("DOMContentLoaded", () => new LazyLoader());