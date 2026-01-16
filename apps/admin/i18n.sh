#!/bin/bash

# 更新翻译文件，需要源翻译文件所在docs分支
doc_branch=$1
docs_remote_url="git@codehub.devcloud.cn-east-3.huaweicloud.com:FHTEK-DOCS00002/FHTEK-DOCS.git"
project_dir=$(pwd)

source=(en-US.json zh-CN.json)
target=(en-US.json zh-CN.json)
# sourceerror=error_to_trans_web.json
# targeterror=code-map.json

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

if [ ${#source[*]} != ${#target[*]} ];then
  beautify_echo "array length not match..." error
  exit -1
fi

# 检查是否指定分支
if [[ $doc_branch == "" ]]
then
  beautify_echo "repo branch required..." error
  exit -1
fi

# 检查目录是否存在
if [ ! -d "FHTEK-DOCS" ];then
  beautify_echo "clone repo..." info
  git clone -b $doc_branch $docs_remote_url
  cd FHTEK-DOCS
else
  beautify_echo "fetch repo..." info
  cd FHTEK-DOCS
  git checkout $doc_branch
  git checkout .
  git pull origin $doc_branch
  git fetch origin
fi

# 拷贝不同客户翻译文件
beautify_echo "copy i18n files..." info

cd trans\\filt-os-i18n

# 判断目录是否存在
if [ ! -d "$project_dir/src/i18n/locales" ]; then
  beautify_echo "mkdir $project_dir/src/i18n/locales" info
  mkdir -p "$project_dir/src/i18n/locales"
fi

for((i=0;i<${#source[*]};i++)) do
  beautify_echo "copy i18n file: ${source[i]}..." info
  if ! cp -f ${source[i]} $project_dir/src/i18n/locales/; then
    beautify_echo "Failed to copy i18n file: ${source[i]}." error
    exit -1
  fi
  beautify_echo "completed copy i18n file: ${source[i]}..." success
done
beautify_echo "completed copy all i18n files..." success

# 拷贝错误码文件，错误码文件是共用的，拷贝公共的错误码文件即可
# beautify_echo "complete copy error files..." info
# cp -f m2_app_code/$sourceerror $project_dir/src/i18n/$targeterror
# beautify_echo "complete copy error files..." success

# 返回上级菜单
cd ..

# 拷贝时区文件
beautify_echo "copy timezone files..." info
if ! cp -f timezone.json $project_dir/src/i18n/locales; then
  beautify_echo "Failed to copy timezone files: ${source[i]}." error
  exit -1
fi
beautify_echo "completed copy timezone files..." success

# 返回上级菜单
cd ..

# 拷贝帮助文件
beautify_echo "copy help files..." info
cp -f help-zh.md $project_dir/src/i18n/locales
cp -f help-en.md $project_dir/src/i18n/locales
beautify_echo "complete copy help files..." success

# 拷贝区域文件
# beautify_echo "copy region files..." info
# cp country_code/zh_CN_region_web.json $project_dir/src/assets/regions/zh-CN.json
# cp country_code/en_US_region_web.json $project_dir/src/assets/regions/en-US.json
# cp country_code/de_DE_region_web.json $project_dir/src/assets/regions/de-DE.json
# cp country_code/nl_NL_region_web.json $project_dir/src/assets/regions/nl-NL.json
# cp country_code/sr_RS_region_web.json $project_dir/src/assets/regions/sr-RS.json
# cp country_code/nb_NO_region_web.json $project_dir/src/assets/regions/nb-NO.json
# cp country_code/fr_FR_region_web.json $project_dir/src/assets/regions/fr-FR.json
# cp country_code/es_ES_region_web.json $project_dir/src/assets/regions/es-ES.json
# beautify_echo "complete copy timezones files..." success
