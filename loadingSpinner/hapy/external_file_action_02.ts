/*
    遅延読み込み完了時、classがlazyloadedに変更することを利用して、外部ファイル読み込み完了時にローディングモジュールと入れ替える方法

    遅延読み込み対象：class = 'lazyload'
    遅延読み完了後：class = 'lazyloaded'
*/ 

const externalFileHead = document.getElementById('external_file_head') as HTMLElement;
const loadingSpinner = document.getElementById('external_file_loading') as HTMLElement;
console.log(document);
console.log(externalFileHead);
externalFileHead.addEventListener('lazyloaded', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'external_file_head') {
        // 遅延読み込み完了後、ローディングモジュールを非表示にする
        loadingSpinner.style.display = 'none';
    }
});
