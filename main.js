const logMain = document.getElementById("log-main");
const logSub = document.getElementById("log-sub");
const inventory = document.getElementById("inventory");

// 正解の答え（必要に応じて変更）
const CORRECT_ANSWER = "ミラー";

const state = {
  escaped: false,
  stage: 1,
};

function setLog(main, sub) {
  if (main) logMain.textContent = main;
  if (sub !== undefined) logSub.textContent = sub;
}

function renderInventory() {
  inventory.innerHTML = "";
  const span = document.createElement("span");
  span.style.color = "#777";
  span.textContent = "手がかりは頭の中にある。";
  inventory.appendChild(span);
}

function showModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove("hidden");
  }
}

function hideModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add("hidden");
  }
}

function resetGame() {
  state.escaped = false;
  state.stage = 1;
  setLog(
    "ここは見知らぬ部屋だ。ドアは固く閉ざされている。",
    "気になる場所をクリックして調べてみよう。"
  );
  renderInventory();
  const title = document.getElementById("room-title");
  if (title) title.textContent = "Room Escape #01";
  hideModal("image-modal");
  hideModal("answer-modal");
  hideModal("clear-modal");
  const input = document.getElementById("answer-input");
  if (input) input.value = "";
}

function goToNextStage() {
  hideModal("clear-modal");
  state.escaped = false;
  state.stage = 2;
  const title = document.getElementById("room-title");
  if (title) title.textContent = "Room Escape #02";
  setLog(
    "別の部屋にたどり着いた。",
    "ステージ2の謎はこれから作り込んでいこう。"
  );
}

// ドア：答え入力モーダルを開く
document.getElementById("door").addEventListener("click", () => {
  if (state.escaped) {
    setLog(
      "もうこの部屋からは脱出している。",
      "別の謎に挑戦したくなってきた。"
    );
    return;
  }

  if (state.stage === 2) {
    setLog(
      "この部屋の仕掛けはまだ準備中だ。",
      "ステージ2の内容をこれから実装しよう。"
    );
    return;
  }

  const input = document.getElementById("answer-input");
  if (input) input.value = "";
  showModal("answer-modal");
  setTimeout(() => {
    input && input.focus();
  }, 10);
});

// 机：ヒント文
document.getElementById("desk").addEventListener("click", () => {
  if (state.escaped) {
    setLog(
      "もう机を調べる必要はなさそうだ。",
      "君はすでに自由だ。"
    );
    return;
  }

  setLog(
    "古びた机だ。上に小さな箱が置かれている。",
    "箱をクリックすると何かが見えるかもしれない。"
  );
});

// Box：画像モーダルを開く
document.getElementById("box").addEventListener("click", () => {
  if (state.escaped) {
    setLog(
      "箱の中身はもう空っぽだ。",
      "謎はすでに解かれている。"
    );
    return;
  }

  showModal("image-modal");
  setLog(
    "箱の中には一枚の画像が入っていた。",
    "じっくり眺めて、答えを導き出そう。"
  );
});

// ポスター：追加ヒント
document.getElementById("poster").addEventListener("click", () => {
  if (state.escaped) {
    setLog(
      "ポスターには小さく『おめでとう』と書かれている。",
      "制作者からのささやかなメッセージだ。"
    );
    return;
  }

  setLog(
    "ポスターには『箱の中身をよく見ろ』と書かれている。",
    "画像の中に数字や形のヒントが隠れているのかもしれない。"
  );
});

// モーダルの×ボタン & 背景クリックで閉じる
document.querySelectorAll("[data-modal-close]").forEach((el) => {
  el.addEventListener("click", (e) => {
    const targetId = el.getAttribute("data-modal-close");
    if (targetId) {
      hideModal(targetId);
    }
  });
});

// 答え入力モーダル：キャンセル
document.getElementById("btn-answer-cancel").addEventListener("click", () => {
  hideModal("answer-modal");
  setLog(
    "ドアの前から少し離れた。",
    "まだ確信が持てないなら、もう一度箱の中身を確認しよう。"
  );
});

// 答え入力モーダル：決定
document.getElementById("btn-answer-ok").addEventListener("click", () => {
  const input = document.getElementById("answer-input");
  const value = input ? input.value.trim() : "";

  if (!value) {
    setLog(
      "何も入力されていない。",
      "画像を見て、何かしらの答えを考えてみよう。"
    );
    return;
  }

  if (value === CORRECT_ANSWER) {
    state.escaped = true;
    hideModal("answer-modal");
    setLog(
      "カチリ、と小さな音がしてドアの鍵が外れた。",
      "正しい答えだったようだ。"
    );
    showModal("clear-modal");
  } else {
    setLog(
      "ドアはびくともしない。",
      "どうやら答えが違うようだ。もう一度画像を見直そう。"
    );
  }
});

// Enter キーで答え送信
document.getElementById("answer-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("btn-answer-ok").click();
  }
});

// リセットボタン
document.getElementById("btn-reset").addEventListener("click", () => {
  resetGame();
});

// クリアモーダル：次のステージへ
document.getElementById("btn-next-stage").addEventListener("click", () => {
  goToNextStage();
});

// 初期表示
resetGame();

