
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.createElement("div");
  overlay.id = "menu-overlay";

  const panel = document.createElement("div");
  panel.id = "menu-panel";

  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  let loaded = false;

  // メニューを閉じる
  function closeMenu() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  // SVG内のボタンに動作を設定
  function setAction(id, action) {
    const element = panel.querySelector(`#${CSS.escape(id)}`);

    if (!element) {
      console.warn("メニュー内のIDが見つかりません:", id);
      return;
    }

    element.setAttribute("pointer-events", "all");

    element.addEventListener("click", (event) => {
      event.stopPropagation();
      action();
    });
  }

  // メニューを開く
  async function openMenu() {
    if (!loaded) {
      try {
        const response = await fetch("menu.svg");

        if (!response.ok) {
          throw new Error("menu.svgを読み込めませんでした");
        }

        const svgText = await response.text();
        panel.innerHTML = svgText;
        loaded = true;

        // 閉じるボタン
        setAction("_バツボタン", closeMenu);
        setAction("_メニュー", closeMenu);

        // 各ページへの移動
        setAction("_ホーム", () => {
          location.href = "index.html";
        });

        setAction("_検索ボタン", () => {
          location.href = "kensaku.html";
        });

        setAction("_印刷ボタン", () => {
          location.href = "preview.html";
        });

        // 図鑑ページは完成後にリンクを設定
      } catch (error) {
        console.error(error);
        alert("メニューを読み込めませんでした。");
        return;
      }
    }

    overlay.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  // メニューの外側を押すと閉じる
  overlay.addEventListener("click", closeMenu);

  // メニュー本体を押しても閉じない
  panel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Escapeキーでも閉じる
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // 各HTMLから呼び出せるようにする
  window.openMenu = openMenu;
});
