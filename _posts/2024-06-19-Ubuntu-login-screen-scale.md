---
title: "[Ubuntu] login screen scale"
date: 2024-06-19 18:00:15 +09:00
categories: [System & Linux]
tags: [Linux, Ubuntu, 오류해결]
pin: true
---

# Ubuntu 24.04 LTS

Ubuntu 20.04 LTS에서 `Hyprland`를 설치해 보기 위해 24.04 LTS 까지 업데이트를 진행했다

헌데 업데이트 후 scale은 200%가 적용되었지만 로그인 화면만큼은 적용되지 않았다

찾아보니 GDM3가 문제라더라..

```shell
raen@seolhwa:~$ cd /usr/share/glib-2.0/schemas/
raen@seolhwa:/usr/share/glib-2.0/schemas$ sudo vi org.gnome.desktop.interface.gschema.xml 
```

scaling-factor 2로 바꾸기

```shell
<key name="scaling-factor" type="u">
      <default>2</default>
      <summary>Window scaling factor</summary>
      <description>
        Integer factor used to scale windows by. For use on high-dpi screens.
        0 means pick automatically based on monitor.
      </description>
```

변경사항 저장

```sh
raen@seolhwa:/usr/share/glib-2.0/schemas$ sudo glib-compile-schemas /usr/share/glib-2.0/schemas/
```

하면 드디어 저장되었다

나중에는 고쳐지겠지?