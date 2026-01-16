#!/bin/bash

branch=$1

# $1 is message for echo
# $2 is echo type, support error|success|info
beautify_echo(){
  case $2 in
    error)
      echo -e "\033[31merror: $1\033[0m"
      ;;
    success)
      echo -e "\033[32msuccess: $1\033[0m"
      ;;
    info)
      echo -e "\033[37minfo: $1\033[0m"
      ;;
    *)
      echo $1
      ;;
    esac
}

# 检查是否指定分支
if [[ $branch == "" ]]
then
  beautify_echo "repo branch required..." error
  exit -1
fi

# 获取所有远程仓库名称
remotes=$(git remote)

# 遍历每个远程仓库并推送代码
for remote in $remotes; do
  git push $remote $branch
done