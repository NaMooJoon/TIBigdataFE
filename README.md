# 한국 통일 빅데이터 센터 KUBIC(Korea Unification Bigdata Center)

KUBiC은 통일과 북한 관련 자료를 더 쉽게 검색하고, 빅데이터 분석을 통해 기존에 파악하지 못한 더 많은 직관과 깊은 통찰을 제공하려는 목적에서 개발되었습니다. 다양한 기관에서 생성되는 통일 및 북한 관련 자료들을 KUBiC에서 통합검색으로 모두 검색할 수 있으며, 주제 분석, 연관 문서 분석 등 다양한 데이터 분석과 데이터 시각화 기능을 제공합니다. KUBiC은 한동대학교 통일선도대학 사업단의 지원으로 개발되었습니다.

## Development Environment [2020.02.28 기준]

- `Angular 11.2.2`
- `NodeJS 15.10.0`
- `MongoDB 4.4.3`
- `npm 7.5.3`

_**All dependencies are recommended to be up-to-date**_

## Project Structure

```
- fe-backend
- src
    - app
        - core
            - components
            - enums
            - guards
            - interceptor
            - models
            - servicies
        - features
        - shared
            - components
    - assets
        - icons
        - logos
    - style.less
```

1.  fe-backend

    유저 정보, 데이터 분석 결과를 저장하는 데이터베이스 서버.
    [[README]](./fe-backend/README.md)

2.  app

    앵귤러 프레임워크로 작성된 웹 어플리케이션

    - core

      웹 어플리케이션 실행 시 단 한번만 생성되는 singleton 요소들을 저장하는 디렉토리

      - components : 모든 페이지에서 실행되는 컴포넌트를 보관한다.
      - enums : 여러번 지속적으로 사용되는 `enum` 타입 파일들을 보관한다.
      - guards : AuthGuard 와 같은 authenication guadring service 를 위한 요소들을 보관한다.
      - interceptor : Token Interceptor 로직 파일을 보관한다.
      - models : 본 홈페이지를 위해 정의된 model 들의 집합. 여러 모듈들에서 사용되는 model을 정의한다.
      - servicies : 한번 실행되고 웹어플리케이션이 종료될 때까지 상태를 업데이트하며 유지하는 서비스들을 보관한다.

    - features

      웹사이트의 각 페이지를 구성하는 모듈과 컴포넌트들을 보관한다.

      - about-kubic : 홈페이지 소개 페이지
      - article-anlysis : 자료분석 페이지
      - article-library : 자료열람 페이지
      - community-board : 커뮤니티 게시판 페이지
      - search-result : 검색결과 페이지
      - search-userpage : 마이페이지 페이지

    - shared

      여러 모듈들에서 공유되는 컴포넌트들을 보관한다.

      - components

      - article-card-view : 문서의 미리보기를 커드형태로 출력하는 컴포넌트
      - article-list-component : 문서 리스트를 출력하는 컴포넌트
      - route-location : 현재 사용중인 페이지 경로를 표시하는 컴포넌트
      - search-bar : 검색 바 컴포넌트

3.  assets

    홈페이지에 사용되는 로고 및 아이콘을 저장한다.

    - icons: 아이콘 저장 위치
    - logos: 로고 저장 위치

4.  style.css(less)

    모든 컴포넌트에 적용하는 global style을 지정하는 파일

## Getting Started

- prerequisite: nodeJS and Angular CLI should be installed

1. Fork this repository into your own.
2. Clone the repository.
3. Move to project root driectory.
4. intall dependencies

   ```bash
   npm install
   ```

5. Run angular application with development server.

   ```bash
   ng s --host <YOUR HOST> --port <YOUR PORT NUMBER>
   ```

   - host and port is optional. default is `localhost` and `4200`
   - This guide is to set development environment. `DO NOT` use this command as actual service. Read "Build Project as a Production" for actual service.

## Build Project as a Production

1. run angular cli with below command

   ```bash
   ng build --prod
   ```

2. `dist` directory will be created in the project root directory.
3. Copy `dist` into server as a resource.
