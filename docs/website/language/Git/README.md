# git

## 忽略大小写

```shell
git config core.ignorecase false
```

## github 慢

```shell
ping github.com
ping fastly.net
```

修改 C:\Windows\System32\drivers\etc\hosts

```
140.82.114.4 github.com
199.232.69.194 github.global.ssl.fastly.net
```

## git 子模块

```shell
git clone <repository> --recursive #递归的方式克隆整个项目
git submodule add <repository> <path> #添加子模块
git submodule init #初始化子模块
git submodule update #更新子模块
git submodule foreach git pull #拉取所有子模块
```
