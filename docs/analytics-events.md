# Before We Eat の追加イベント

2026-11-23。既存の測定ID G-HBPDX2M5HR と各ページのGoogleタグを使う。ローダーや config は追加しない。

| イベント | 発火条件 | 主なパラメーター |
| --- | --- | --- |
| bwe_core_view | 対象本文が50%以上、表示中のタブで連続5秒見えた時。1ページ表示につき1回 | bwe_block=main |
| bwe_detail_view | トップの補足ダイアログが showModal で実際に開いた後 | bwe_detail_id=welfare/space/rest/care/cooking |
| bwe_animal_reveal | 動物の図解が閉じた状態から実際に開いた後。閉じる操作や動物選択ボタンだけでは送らない | bwe_animal=pig/cow/hen、bwe_interaction=pointer/keyboard/control |
| bwe_novel_promo_view | トップの小説紹介が50%以上、表示中のタブで連続1秒見えた時。1ページ表示につき1回 | bwe_work_id=ninzuubun、bwe_placement=homepage |
| select_content | 同サイトの別のHTML記事・小説・索引への選択。PDF・ダウンロード・外部リンクは除外 | content_id、content_type、bwe_placement |
| bwe_novel_read | 既設。小説本文が10%以上、表示中のタブで連続10秒見えた時。1場面表示につき1回 | bwe_work_id、bwe_scene_id、bwe_chapter |
| bwe_novel_scene_end | 既設。場面末尾が10%以上、表示中のタブで連続5秒見えた時 | 上記に加え is_final_scene |
| bwe_novel_resume | 既設の「続きから」リンク選択 | bwe_work_id |
| bwe_case_open | 既設の現場記録詳細が開いた時 | bwe_case_id |
| bwe_search_results | 既設検索の更新1秒後。検索語は送らない | bwe_search_location、bwe_result_count=zero/one/two_to_ten/eleven_plus |
| bwe_print_request | 既設の印刷操作。印刷完了を意味しない | bwe_page_path |

## 既存設定との分担

- bwe_novel_view はGA4側の page_view からの生成設定を維持し、サイトコードから送らない。
- bwe_novel_read の既存キーイベント設定を変更せず、同じ意味の新規イベントを作らない。
- page_view・scroll・外部リンク・PDFダウンロードの自動計測を再実装しない。
- 共通スクリプトの複数読込時もイベントリスナーは1組だけ。表示判定は非表示・領域外で時間をリセットし、タブ復帰後は連続時間を測り直す。
- 対象本文は main 内の data-bwe-core 指定を優先し、未指定の既存ページは従来の最初の40文字超の本文段落を使う。

## 送信内容

送信先を既存の測定IDへ固定。イベントの page_location と page_referrer からクエリ・フラグメントを除く。自由入力、検索語、個人名、作品本文、画像はパラメーターに含めない。GA4の ga-disable-G-HBPDX2M5HR を尊重し、送信エラーで閲覧・操作を中断しない。GA管理画面の受信状況やカスタムディメンション登録は本コミットで変更しない。

## 変更の確認

公開前の局所実行で連続表示・タブ復帰・二重バインド・ダイアログ/図解の発火・小説読書の一度限りの送信・検索件数区分・クエリ除外・送信停止/例外を確認。公開後は代表ページの最小確認とする。
