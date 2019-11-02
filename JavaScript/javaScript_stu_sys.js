
TableDataList = [];//存储数据
 pageSize = 5; //页面显示的条数
 curPage = 1 ;//当前页
//左侧导航中的学生列表
var stu_list_dom = document.getElementsByClassName('left-menu')[0].getElementsByTagName('dd')[0];
var modle = document.getElementsByClassName('modle')[0];
// 切换样式
 function tabStyle(oListDom,classNameActive,targetDOM){
         for( var i = 0 ; i < oListDom.length;i++){
             oListDom[i].classList.remove(classNameActive);
         }
           targetDOM.classList.add(classNameActive)
 }
//绑定页面所有的事件
function bindEvent(){
   //左侧切换导航
   var  menuList = document.getElementsByClassName('left-menu')[0];
   menuList.addEventListener('click',function(e){
       //切换样式
    var tagName = e.target.tagName
    if(tagName == 'DD'){
       var oDD = menuList.getElementsByTagName('dd');
        tabStyle(oDD,'active',e.target)
        var id = e.target.getAttribute('data-id');
        var right_content =document.getElementById(id);
        var content_active = document.getElementsByClassName('rightActive')
        tabStyle(content_active,'rightActive',right_content)
       if(id =='stuList'){
           getTableData();
       }
    }
   },false);


   //添加学生事件
   var addBtn = document.getElementById('Addsubmit');
   addBtn.addEventListener('click',function(e){
       e.preventDefault();
    var addStuForm = document.getElementById('add-stut');
    var dataTable = formData(addStuForm);
    if(dataTable.msg){
        alert(dataTable.msg);
        return false;
    }else{
        transformData('/api/student/addStudent',dataTable.data,function(){
            alert('新增学生成功');
            document.getElementById('add-stut').reset();
            stu_list_dom.click();
        })
    }
   },false);


   
   //搜索框查询
    var search_btn = document.getElementById('searchBtn');
        search_btn.addEventListener('click',function(e){
            var search_word = document.getElementById('search_word').value
            if(search_word){
                curPage = 1
                search_word_handle(search_word)
            }else{
                getTableData()
            }
         },false)
    //  关键字查询函数
function search_word_handle(search_word){
    transformData('/api/student/searchStudent',{
        sex:-1,
        search:search_word,
        page:curPage,
        size:pageSize
      },function(res){
          TableDataList = res.data.searchList
          new Page({
            container:document.getElementsByClassName('pagesList')[0],
            current:curPage,
            dataCount:res.data.cont,
            pageSize:pageSize,
            panelNumber:5,//展示页码数量
            changPage_callback:function(page){
                curPage  = page
                search_word_handle(search_word)
            }
        })
          renderTablePage(res.data.searchList)
      })
}
       
   //查询全部学生
   var allBtn = document.getElementById('Btn');
   allBtn.addEventListener('click',function(e){
    transformData('/api/student/findAll',{
        appkey:'xiao_baobao_1572690519053',
    },function(res){
        renderTablePage(res.data)
        alert('查询成功');
    });
   },false);

   //编辑按钮点击事件
    var edit_btn = document.getElementById('editBtn'); 
    edit_btn.addEventListener('click',function(e){
        e.preventDefault();
         var editStudent = document.getElementById('editStu');
          var resultData = formData(editStudent)
        transformData('/api/student/updateStudent',resultData.data,function(res){
            if(res.status == 'success'){
                alert('修改成功');
                document.getElementById('editStu').reset();
                stu_list_dom.click();
            }else{
               alert(res.msg)
            }
        })

     },false)



//关闭按钮事件
   var closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.addEventListener('click',function(e){
        modle.style.display = 'none'
    },false)
}

//如果id == stulist 获取学生列表数据
function getTableData(){
    var showNumberData = document.getElementById('show-data');
    transformData('/api/student/findByPage',{
        page:curPage,
        size:pageSize
    },function(res){
        showNumberData.innerText = res.data.cont
        TableDataList = res.data.findByPage
        new Page({
            container:document.getElementsByClassName('pagesList')[0],
            current:curPage,
            dataCount:res.data.cont,
            pageSize:pageSize,
            panelNumber:5,//展示页码数
            changPage_callback:function(page){
                curPage  = page
                getTableData()
            }
        })
        renderTablePage(res.data.findByPage)
    })
}



//获取数据渲染页面
function renderTablePage(data){
    var tBody = document.getElementsByClassName('tdy')[0];
      var strHTML = " ";
    data.forEach(function(item,index){
        strHTML +=`
        <tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${(item.sex == 0 ? '男':'女')}</td>
        <td>${item.email}</td>
        <td>${(new Date().getFullYear() - item.birth)}</td>
         <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <button class="btn eidt" id="editBtn" data-index = ${index}>编辑</button>
            <button class="btn del" id="delBtn" data-index = ${index}>删除</button>
        </td>
    </tr>
        `
    })
    tBody.innerHTML = strHTML;
    //删除、编辑按钮事件
    tableBindEvent();
}

// 编辑、删除事件
function tableBindEvent(){
    var tBodyEidt = document.getElementById('stu-tbody');
    tBodyEidt.addEventListener('click',function(e){
         var tagName = e.target.tagName
           if( tagName == 'BUTTON'){
               var isEidt = Array.from(e.target.classList).includes('eidt')
            // var isEidt = [].slice.call(e.target.classList, 0).indexOf('eidt') > -1;
               if(isEidt){
                modle.style.display = 'block'
                var index = e.target.getAttribute('data-index');
                tableInfoData(TableDataList[index])
               }else{
                var index = e.target.getAttribute('data-index');
                var  isDel = window.confirm('是否删除该学员信息？？');
                if(isDel){
                    transformData('/api/student/delBySno',{
                        sNo:TableDataList[index].sNo
                    },function(){
                            alert('删除成功');
                            getTableData();
                    })
                 }
               }
           }
    },false)
}
    
   

//数据序列化
function formData(dom){
    var result = {
         data :{},
         msg:'',
    }
    var name = dom.name.value,
        sNo = dom.sNo.value,
        sex = dom.sex.value,
        email = dom.email.value,
        birth = dom.birth.value,
        phone = dom.phone.value,
        address = dom.address.value;
    if (!name || !sNo || !sex || !email || !birth || !phone || !address){
        alert('数据为写全')
    }else{
        result.data = {
            name:name,
            sNo:sNo,
            sex:sex,
            email:email,
            birth:birth,
            phone:phone,
            address:address
        }
    }
    return result;
}


//信息回填
function tableInfoData(data){
    var eidtForm = document.getElementById('editStu');
    for( var prop in data){
        if(eidtForm[prop]){
            eidtForm[prop].value = data[prop];
        }
    }
}


//封装共有的数据处理函数
function transformData(url,data,callback){
      var response = API('https://open.duyiedu.com' + url,Object.assign({
          appkey:'xiao_baobao_1572690519053',
        }, data));
        if(response.status == 'success'){
            callback(response)
        }else {
            alert(response.msg);
        }
}



//数据交互 API
function API(baseURL_api,params){
    var xhr = null;
    var result = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if(typeof params =='string'){
        xhr.open('GET',baseURL_api + '?' + params,false)
    }else if(typeof params == 'object'){
        var str = " " ;
        for( var prop in params){
            str += '&' + prop + '=' + params[prop] ;
        }
        xhr.open('GET',baseURL_api + '?' + str ,false);
    }else{
        xhr.open('GET', baseURL_api + '?' + params.toString(), false)
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
     xhr.send()
    return result;
}
//初始化
function init(){
  bindEvent();
  stu_list_dom.click();
}
init()