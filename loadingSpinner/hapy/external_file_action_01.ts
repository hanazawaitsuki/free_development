/*
    setTimeoutを利用して、一定の時間が経過したらローディングを削除し、外部ファイルエリアを表示する方法
*/ 

document.addEventListener('DOMContentLoaded',() => {
    setLoading('external_file_head')
});

/// 外部ファイルの読み込み中、ローディングモジュールを表示するためにタイマーをセットする
function setLoading (selector: string) {
    /// 3秒後に
    setTimeout(callback, 3000, selector);
}

/// コールバック関数
/// 本当はキレイにしたいが、一旦動かすために直接渡す
function callback (selector: string) {
    removeLoading('external_file_loading');
    showExternalFileArea(selector);
}

/// is-loading削除
/// is-loadingはローディング中だけ付けるclass（明示的にするために設定）
function removeLoading (selector: string) {
    const target = document.getElementById(selector) as HTMLElement;
    if (target.id === 'external_file_loading') {
        target.classList.remove('is-loading');
        displayNoneLoading(selector);
    }
}

/// ローディングモジュールを非表示にする
function displayNoneLoading (selector: string) {
    const target = document.getElementById(selector) as HTMLElement;
    if (target.id === 'external_file_loading') {
        target.style.display = 'none';
    }
}

/// 外部ファイルエリア表示
function showExternalFileArea (selector: string) {
    const target = document.getElementById(selector) as HTMLElement;
    if (target.id === 'external_file_head') {
        target.style.display = '';
    }
}