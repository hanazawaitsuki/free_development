/*
    Geminiに書かせてみた
*/ 

document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay') as HTMLTimeElement;
    const contentContainer = document.getElementById('content-container') as HTMLTimeElement;
    const lazyFileUrl = 'lazy_content.html'; // 遅延読み込みする外部HTMLファイルのURL

    if (!loadingOverlay || !contentContainer) {
        console.error('必要なDOM要素が見つかりません。');
        return;
    }

    // ローディングオーバーレイを表示
    loadingOverlay.classList.remove('hidden');

    let totalLazyElements = 0; // 遅延読み込み対象の要素の総数
    let loadedLazyElements = 0; // 読み込みが完了した遅延読み込み要素の数

    // すべての遅延読み込み要素が完了したかチェックし、完了したらオーバーレイを非表示にする関数
    const checkIfAllLazyElementsLoaded = () => {
        // totalLazyElementsが0の場合（画像などがない場合）、または全てロード済みの場合
        if (totalLazyElements === 0 || loadedLazyElements >= totalLazyElements) {
            loadingOverlay.style.display = 'none';
            console.log('すべてのコンテンツと遅延読み込み要素の読み込みが完了しました。');
        }
    };

    // 外部HTMLファイルを遅延読み込みする関数
    async function loadLazyContentHtml() {
        try {
            const response = await fetch(lazyFileUrl);
            if (!response.ok) {
                throw new Error(`HTTPエラー: ${response.status}`);
            }
            const contentHtml = await response.text();

            // 読み込んだコンテンツをコンテナに挿入
            contentContainer.innerHTML = contentHtml;

            // lazysizesがDOMをスキャンするように再トリガー (通常は不要だが、動的コンテンツ挿入時は推奨)
            // lazysizes.unveil は lazysizes のプライベートAPIですが、必要に応じて使用します。
            // あるいは、lazysizesの 'ls.ready' イベントや 'lazybeforeunveil' イベントを利用して
            // ロード状況を追跡することも可能です。
            // ここでは、単純に挿入されたlazyload要素をカウントします。

            const newlyAddedLazyElements = contentContainer.querySelectorAll('.lazyload');
            totalLazyElements = newlyAddedLazyElements.length;

            if (totalLazyElements === 0) {
                // 遅延読み込み画像などが含まれていない場合、すぐにローディングを非表示にする
                checkIfAllLazyElementsLoaded();
            } else {
                // lazyloadedイベントをリッスンして、画像などの読み込み完了を追跡
                newlyAddedLazyElements.forEach(element => {
                    element.addEventListener('lazyloaded', () => {
                        loadedLazyElements++;
                        console.log(`要素がロードされました: ${element.tagName}. 完了済み: ${loadedLazyElements}/${totalLazyElements}`);
                        checkIfAllLazyElementsLoaded();
                    }, { once: true }); // 一度だけ実行されるように設定
                });
            }

            console.log('外部HTMLファイルの読み込みとDOMへの挿入が完了しました。');

        } catch (error) {
            console.error('外部ファイルの読み込みに失敗しました:', error);
            // エラー時にもローディングを隠し、エラーメッセージを表示するなど適宜対応
            loadingOverlay.innerHTML = '<p style="color: red;">コンテンツの読み込みに失敗しました。</p>';
        }
    }

    // 遅延読み込みを開始
    loadLazyContentHtml();
});