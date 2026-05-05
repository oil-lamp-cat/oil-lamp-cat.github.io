---
title: "[wargame] overthewire bandit 9 -> 10"
date: 2024-02-01 00:25:25 +09:00
categories: [Security & Hacking, Bandit]
tags: [Linux, OverTheWire]
---

## Bandit Level 9 -> Level 10

**user_id** : bandit9<br/>
**password** : 4CKMh1JI91bUIZZPXDqGanal4xvAg0JM

![bandit9_10](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4744e711-77f3-466b-bb3f-0dff4f3cf79f)

### 목표

다음 레벨로 가는 비밀번호는 `data.txt` 파일 안에 `human-readable` 즉 사람이 읽을 수 있는 문자열로 몇개의 `=` 문자 뒤에 나온다.

### 해결법

한번 `grep`명령어로 `=`문자열을 찾아볼까요?

![bandit9_10_grep_result](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/4a5bc229-1e2e-4a10-8755-a7da146f5695)

이런 사람이 읽을 수 있는 텍스트(text)파일이 아니라 바이너리(binary: 데이터의 저장과 처리를 목적으로 0과 1의 이진 형태로 인코딩된 파일)이다보니 grep 명령어를 사용할 수 없다고 한다.

`grep`명령어의 옵션 중에는 `-a`옵션이 있는데 이 옵션이 바로 바이너리를 텍스트 파일처럼 처리해주는 옵션이라고 합니다.

```shell

bandit9@bandit:~$ cat data.txt | grep -a "=="
"x����$�WI��G���gq��B�ș�q6�p�|r9����K�|��[�l������#0jb�7u��uf`e�Y�o�    ?>�?���F��){�x%�1�c3    ��l�XQz�U0��
                                                                                                            �O-@����E�8�jr��i��$�]�:[������x]T========== theG)"�)<�!G��{��X8�?��5�&���O:�@N��s~�i\6�Xz     ����==��S�igy����>�m���P�I�ݰ���C+x�[ڋ�e22�a�
�{��\nF���<��D� �M�f*I�`�@oݗn�ײ�p�n��Y�����x�n�����ۓ�4j\9̷�n:�J�Va���K��+        ���f��Z9�)��Q�Ѻ?��r��.���O[��6�^FS�========== passwordk^�ټ����1>���jg�S�>�����5~�I�-�"��G|�����6L�"�� �T�'����j�T=������2_�q+T6(�p
                                                                                               '
�T����T�p#fz:�LJ�r*;�o#�E�hϻ��/]��&x��:!�Oη��[%ug�Z��hݹkj��D����ZH���Ed����ZE������4K�?�p������z�iw?������J������^`t d�;T��ڪ`��M�T�/�j�M�Ł��$����O�Msh��������8��========== is�w
.�Ze�x��J���i��_qhlbw���X�yϪ�.�-3������7�T�����             Ke@�&,]D���%�v�
:��g����yV�M]��Vf��̤��i�L�u#�&ZR�7٬.׳?L6>�D�GC�:jЂ��}��=��T�k�@I]j5�}0Ļ�_�zW5E��f3c�ᦩ�a��Ozݏ������:�Dr%[+��*2lk���X�齲g/$�%��g�Z"g��x�
A�tL[�#��Ƴ���wv..ک!�5��nH�mwQ!2��Fu�cp��B�;ݍ�UH�NEz+�w�'�w$F��6�L�l��ܤ
�(���k�}�N l�E����*�9�<u2����_0�Y���4�`�w�j:6�ek�{OXr���/��?d�mH�m�3�EM`�om�x��۽�>���Ihe�X��N�tz�xb�(X�1��oPZ�ɱ�ݿQ��{�%�xV��۵G�{TbJ;=l��J�Q�/��,��??r)SՒ98UU��jߗc-�?4���6�[�$�J��S��ۿv��P��u$��4+�2ʾ�$�oI�[=lI���a6�ȁ
                                                                                                  ×/%Â���w�����l��eu-)E��f�n���%����Ƙ�p��~��L�]wPP�J��O1#�{"@Ip�I�2��Di�����T�m�Gf�rSa
���LN�|�r1�7�6��8������<D�_o��kV�Jx�#���[�����딭��E�����O.x�s�薲�Ҋ����I��t�.�RF�L�V¡G�D�5c
                                                                                          %�0d������^b�C�EX��I��,S߫��)o��8/�-��ďRj$�e0G�rx70yJ{��|Ƞ��ÒX     5��a���C�2����{�5���8+�dm)��Z�R��
                                                                         |�q���E�C��[�qX2R^{X���҉�WH     fU�����B�|�������j��n�c����`����yq��       ����������E�0�Mhr��Xw�<Ͱ�[      �N�iޑ2KYl�A���)�#pJ_�)�]�PJoZP�EW��-"�ְ��D��Yq5� �G^xu�,-ҏ���i�o}2��j��Ֆ�����[:ˇ52��)"t     jh�y��========== G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s

```

음 딱 보아하니 맨 아래 있는 `G7w8LIi6J3kTb8A7j9LgrywtEUlyyp6s`가 비밀번호 인듯 하지만 우리는 이것보다 더 깔끔한 결과를 찾아보도록 하죠.

위 문제를 해결하기 위한 방법은 우리가 보통 파일을 읽을 때에는 `cat`명령어를 사용하였지만 이번에는

> strings : 파일의 문자열을 출력

`strings` 명령어를 사용해 보도록 하겠습니다. 이렇게 함으로써 문제의 힌트였던 `human-readable` 텍스트만 출력되게 될 것이다.

![bandit9_10_sol](https://github.com/oil-lamp-cat/oil-lamp-cat.github.io/assets/103806022/71337889-8e96-4163-af94-f2466eda7b22)

이제야 모든 조건을 사용하면서 비밀번호를 찾아냈다!

`the password is FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey`

비밀번호 : `FGUW5ilLVJrxX9kMYMmlN4MgbpfMiqey`
