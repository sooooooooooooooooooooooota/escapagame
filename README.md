# escapegame

ブラウザで動く脱出ゲームと、Java バックエンドのサンプルプロジェクトです。

## 構成

- `index.html`  
  HTML / CSS / JavaScript だけで動くシンプルな脱出ゲーム。

- `pom.xml`  
  Maven プロジェクト定義。Java 17 を前提としています。

- `src/main/java/com/example/escapegame/App.java`  
  Java アプリケーションのエントリーポイント（`main` メソッド）。

- `src/test/java/com/example/escapegame/AppTest.java`  
  JUnit5 を使ったサンプルテスト。

## ビルドと実行 (Java 側)

プロジェクトルート（このファイルと `pom.xml` がある場所）で:

```bash
mvn clean package
```

Java を実行する場合:

```bash
mvn exec:java -Dexec.mainClass="com.example.escapegame.App"
```

※ まだバックエンドの機能は何もありません。今後、API やゲームロジックを追加していく前提の土台です。

## ブラウザゲームの起動

`index.html` をブラウザで開くだけでプレイできます（ダブルクリックで OK）。

