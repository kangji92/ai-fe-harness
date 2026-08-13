# 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org)를 따른다.

## 형식

```
<type>: <제목 (72자 이내)>

<본문 — "왜"를 설명 (선택)>
```

## type

- `feat` 기능 추가
- `fix` 버그 수정
- `refactor` 동작 변경 없는 구조 개선
- `test` 테스트 추가/수정
- `docs` 문서
- `chore` 빌드·설정·잡무

## 규칙

- 제목은 명령형·현재형 ("추가한다"가 아니라 "add"/"추가")
- 하나의 커밋 = 하나의 논리적 변경
- 본문에는 무엇보다 **왜**를 남긴다

## 예시

```
feat: add Button variant support

primary/secondary 두 톤이 필요해 data-variant로 분기.
접근성을 위해 disabled 시 클릭 차단 테스트 포함.
```
