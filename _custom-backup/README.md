# Chirpy 커스텀 백업

Chirpy 테마를 업데이트하면 `_layouts/post.html`처럼 직접 덮어쓴 파일은 새 테마 버전을 따라가지 않는다.
업데이트할 때 아래 커스텀을 새 테마 파일에 다시 옮겨 넣기 위한 백업.

`_`로 시작하는 폴더라 Jekyll 빌드 결과(`_site`)에는 포함되지 않는다.

## 파일

| 파일 | 내용 |
| --- | --- |
| `7.5.0/post.html` | 현재 사용 중인 `_layouts/post.html` 원본 (테마 7.5.0 기반) |
| `7.5.0/glightbox-loader.html` | `_includes/glightbox-loader.html` 원본 |
| `7.5.0/jekyll-theme-chirpy.scss` | `assets/css/jekyll-theme-chirpy.scss` 원본 |
| `password-protect.html` | `post.html`에서 비밀번호 잠금 부분만 떼어낸 조각 |

## 테마 기본 post.html 대비 커스텀 내역

테마 7.5.0의 `_layouts/post.html`과 비교했을 때 실제로 다른 부분은 두 가지뿐이다.
(나머지 차이는 Prettier가 줄바꿈/들여쓰기를 바꾼 것)

1. **front matter의 `script_includes`에 `glightbox-loader` 추가**
   ```yaml
   script_includes:
     - comment
     - glightbox-loader
   ```
2. **`<div class="content">` 안의 `{{ content }}`를 비밀번호 잠금으로 교체**
   - 글 front matter에 `password: xxx`가 있으면 잠금 화면을 보여주고, 맞으면 본문을 표시
   - 해당 코드 = `password-protect.html`

그 외에 `assets/css/jekyll-theme-chirpy.scss`에 GLightbox 이미지 팝업 크기 관련 CSS가 추가되어 있다.
(`_includes/glightbox-loader.html`, scss는 테마가 덮어쓰지 않으므로 업데이트해도 그대로 유지됨)

## 새 테마 버전에 다시 적용하는 법

1. 새 버전 gem의 `_layouts/post.html`을 `_layouts/post.html`로 복사
   (`bundle info --path jekyll-theme-chirpy` 로 gem 경로 확인)
2. front matter `script_includes`에 `- glightbox-loader` 추가
3. `<div class="content">` 안의 `{{ content }}` 를 `password-protect.html` 내용으로 교체
   - 또는 `password-protect.html`을 `_includes/`로 옮기고 `{% include password-protect.html %}` 한 줄로 교체
