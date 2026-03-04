const logMain = document.getElementById("log-main");
const logSub = document.getElementById("log-sub");
const inventory = document.getElementById("inventory");

// 正解の答え（必要に応じて変更）
// ダイヤルは 3 文字想定（例: "ミラー"）
const CORRECT_ANSWER = "ミラー";

// ダイヤルで選べる文字（正解に使う文字 + 残り6つは適当）
const DIAL_CHARS = ["カ", "ラ", "ア", "ミ", "ギ", "ド", "ー", "ハ", "コ"];

const DIAL_LENGTH = 3;
let dialIndices = Array.from({ length: DIAL_LENGTH }, () => 0);

const state = {
  escaped: false,
  stage: 1,
  hasKey: false,
  keyTakenOnce: false,
  boxOpened: false,
};

function setLog(main, sub) {
  if (main) logMain.textContent = main;
  if (sub !== undefined) logSub.textContent = sub;
}

function renderInventory() {
  inventory.innerHTML = "";
  if (state.hasKey) {
    const img = document.createElement("img");
    img.src = "key.png";
    img.alt = "鍵";
    img.className = "inventory-key";
    inventory.appendChild(img);
  } else {
    const span = document.createElement("span");
    span.style.color = "#777";
    span.textContent = "何も持っていない。";
    inventory.appendChild(span);
  }
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

function getDialAnswer() {
  return dialIndices.map((idx) => DIAL_CHARS[idx] ?? "?").join("");
}

function renderDials() {
  for (let i = 0; i < DIAL_LENGTH; i++) {
    const el = document.getElementById(`dial-value-${i}`);
    if (el) el.textContent = DIAL_CHARS[dialIndices[i]] ?? "?";
  }
  const preview = document.getElementById("dial-preview-text");
  if (preview) preview.textContent = getDialAnswer();
}

function resetDials() {
  dialIndices = Array.from({ length: DIAL_LENGTH }, () => 0);
  renderDials();
}

function rotateDial(index, delta) {
  const len = DIAL_CHARS.length;
  if (len <= 0) return;
  const current = dialIndices[index] ?? 0;
  const next = (current + delta + len) % len;
  dialIndices[index] = next;
  renderDials();
}

function updateRoomObjects() {
  const box = document.getElementById("box");
  const paper = document.getElementById("paper");
  if (!box || !paper) return;

  const boxImg = box.querySelector("img");
  if (boxImg) {
    if (state.stage === 2 && state.boxOpened) {
      boxImg.src = "paper.png";
      boxImg.alt = "紙";
      box.title = "紙";
    } else {
      boxImg.src = "takarabako.png";
      boxImg.alt = "宝箱";
      box.title = "宝箱";
    }
  }

  if (state.stage === 1) {
    paper.style.display = "flex";
    box.style.display = "none";
  } else {
    paper.style.display = "none";
    box.style.display = "flex";
  }
}

function resetGame() {
  state.escaped = false;
  state.stage = 1;
  state.hasKey = false;
  state.keyTakenOnce = false;
  state.boxOpened = false;
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
  hideModal("key-modal");
  resetDials();
  updateRoomObjects();
}

function goToNextStage() {
  hideModal("clear-modal");
  state.escaped = false;
  state.stage = 2;
  state.hasKey = false;
  state.keyTakenOnce = false;
  state.boxOpened = false;
  const title = document.getElementById("room-title");
  if (title) title.textContent = "Room Escape #02";
  setLog(
    "別の部屋にたどり着いた。",
    "ステージ2の謎はこれから作り込んでいこう。"
  );
  renderInventory();
  updateRoomObjects();
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

  resetDials();
  showModal("answer-modal");
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
    "古びた机だ。上に一枚の紙が置かれている。",
    "紙をタップして内容を確認してみよう。"
  );
});

// 紙：ステージ1の手がかり
document.getElementById("paper").addEventListener("click", () => {
  if (state.escaped) {
    setLog(
      "もう紙の内容は頭に入っている。",
      "次の謎に進んでも良さそうだ。"
    );
    return;
  }

  showModal("image-modal");
  setLog(
    "紙には何かのヒントが書かれている。",
    "じっくり眺めて、答えを導き出そう。"
  );
});

// Box：ステージ2で中から紙が出てくる
document.getElementById("box").addEventListener("click", () => {
  if (state.escaped) {
    setLog(
      "箱の中身はもう空っぽだ。",
      "謎はすでに解かれている。"
    );
    return;
  }

  if (state.stage === 1) {
    setLog(
      "今はこの箱には用がなさそうだ。",
      "まずは机の上の紙を確認してみよう。"
    );
    return;
  }

  if (!state.hasKey) {
    setLog(
      "頑丈な箱だ。小さな鍵穴が見える。",
      "どこかに合う鍵が隠れていそうだ。"
    );
    return;
  }

  showModal("image-modal");
  if (!state.boxOpened) {
    state.boxOpened = true;
    state.hasKey = false;
    renderInventory();
    updateRoomObjects();
    setLog(
      "箱の中から一枚の紙が出てきた。",
      "紙の内容をよく読んでみよう。"
    );
  } else {
    setLog(
      "箱の中には先ほどの紙が入っている。",
      "気になるところがあれば、もう一度よく見直そう。"
    );
  }
});

// ポスター：ステージ1はヒント、ステージ2では鍵を入手
document.getElementById("poster").addEventListener("click", () => {
  if (state.escaped) {
    setLog(
      "ポスターには小さく『おめでとう』と書かれている。",
      "制作者からのささやかなメッセージだ。"
    );
    return;
  }

  if (state.stage === 1) {
    setLog(
      "ポスターには『机の上の紙を読め』と書かれている。",
      "紙をタップして内容を確認してみよう。"
    );
    return;
  }

  if (state.keyTakenOnce) {
    setLog(
      "ポスターの裏はもう調べ尽くした。",
      "鍵はもう手に入らないようだ。"
    );
    return;
  }

  if (!state.hasKey) {
    state.hasKey = true;
    state.keyTakenOnce = true;
    renderInventory();
    showModal("key-modal");
    setLog(
      "ポスターの裏から小さな鍵を見つけた。",
      "この鍵なら机の上の箱を開けられるかもしれない。"
    );
  } else {
    setLog(
      "ポスターの裏はもう調べた。",
      "鍵はしっかりポケット（インベントリ）に入っている。"
    );
  }
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
  const value = getDialAnswer();

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

// ダイヤル操作
document.querySelectorAll("[data-dial-index][data-dial-delta]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const index = Number(btn.getAttribute("data-dial-index"));
    const delta = Number(btn.getAttribute("data-dial-delta"));
    if (Number.isFinite(index) && Number.isFinite(delta)) {
      rotateDial(index, delta);
    }
  });
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

