function Page(options){
      this.container = options.container; //容器
      this.current = options.current ;//当前页
      this.allPage = options.allPage ;//总页码
      this.prevText = options.prevText || '上一页';//上一页
      this.nextText = options.nextText || '下一页';//下一页
      this.pageLimit = options.pageLimit;
      this.panelNumber = options.panelNumber;//限制显示多少页码
      this.dataCount = options.dataCount;//数据总数量
      this.pageSize = options.pageSize;//数据展示多少
      this.changPage_callback = options.changPage_callback || function(){};
      this.showPage()
}
Page.prototype.getMinPageIndex = function () {
    var half = Math.floor(this.panelNumber / 2);
    var min = this.current - half;
    if (min < 1) {
        min = 1;
    }
    return min;
}
Page.prototype.getMaxPageIndex = function () {
    var min = this.getMinPageIndex();
    var pageNumber = Math.ceil(this.dataCount / this.pageSize);
    var max = min + this.panelNumber - 1;
    if (max > pageNumber) {
        max = pageNumber;
    }
    if(max >=this.allPage){
        this.allPage = max
    }
    return max;
}
//展示页码页面
Page.prototype.showPage = function (){
    this.container.innerHTML = '';
    if(this.allPage === 0){
         return;
    }
    this.createPrevDOM();//创建上一页
    this.createPageNumbers();//创建页码
    this.createNextDOM();//创建下一页

}
// 创建共有的dom
Page.prototype.createDOM = function(text,className){
    var a = document.createElement("a");
    a.innerHTML = text;
    a.href = "javascript:;";
    return a;

}
Page.prototype.getPageNumber = function(){
    return Math.ceil(this.allPage / this.pageLimit)
}
//改变页数
Page.prototype.changPage = function(page){
    if(page === this.current){
        return 
    }
    if(page > this.getPageNumber()){
        page = this.getPageNumber()
    }
    if(page < 1){
        page = 1
    }
    this.current = page;
    this.showPage();
    this.changPage_callback && this.changPage_callback(this.current);
} 
//创建上一页
Page.prototype.createPrevDOM = function(){
     var dom = this.createDOM(this.prevText);
      dom.className = 'prev-page';
      if(this.current === 1){
        dom.classList.add("disabled");
        dom.removeEventListener('click',this.changPage.bind(this,this.current - 1 ))
      }else{
        dom.addEventListener('click',this.changPage.bind(this,this.current - 1 ));
      }
       this.container.appendChild(dom);
}
//创建页码
Page.prototype.createPageNumbers = function(){
    var min = this.getMinPageIndex();
    var max = this.getMaxPageIndex()
          for(var i = min; i <= max;i++){
              var dom = this.createDOM(i);
              dom.className = 'item-number';
              if(i === this.current){
                 dom.classList.add('active');
              }else{
                dom.classList.remove('active');
              }
              dom.addEventListener("click", this.changPage.bind(this, i));
              this.container.appendChild(dom);
          }
         
}
//下一页
Page.prototype.createNextDOM = function(){
    var all = Math.ceil(this.dataCount / this.pageSize)
    var dom = this.createDOM(this.nextText);
     dom.className = 'next-page';
     if(this.current == all){
        dom.classList.add('disabled')
        dom.removeEventListener('click',this.changPage.bind(this,this.current + 1))
     }else{
        dom.addEventListener('click',this.changPage.bind(this,this.current + 1));
     }
        this.container.appendChild(dom)

}
