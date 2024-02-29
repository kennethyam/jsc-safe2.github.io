function layer_sitesearch_init_func(param,urllist,searchFlag){
	var wp_productsearchcache=param.wp_productsearchcache;
	var langs=param.langs;
	var layerid=param.layer_id;
	var curseachtype='product';
	var resswitch = param.sswitch?param.sswitch:'1';

	function getCacheType(searchtype){
		var dfd=$.Deferred();
		if(searchtype=='article' && resswitch == '1'){
			if(window.wp_articlesearchcache != null){
				dfd.resolve(window.wp_articlesearchcache)
			}else{
				$.ajax({
					url:parseToURL("sitesearch","article_titlesearch",{'layerid':layerid}),
					success:function(data){
						window.wp_articlesearchcache = eval(data);
						$('body').data('wp_searchcache',window.wp_articlesearchcache);
						dfd.resolve(window.wp_articlesearchcache);
					}
				});
			}
		}else{
			if(resswitch == '1'){
                if(window.wp_productsearchcache != null){
                    dfd.resolve(window.wp_productsearchcache)
                }else{
                    $.ajax({
                        url:parseToURL("sitesearch","product_autocomplete",{'layerid':layerid}),
                        success:function(data){
                            var res=$.parseJSON(data);
                            if(res.result=='OK'){
                                window.wp_productsearchcache = res.data;
                                $('body').data('wp_searchcache',window.wp_productsearchcache);
                                dfd.resolve(window.wp_productsearchcache);
                            }
                        }
                    });
                }
			}
		}
		return dfd;
	}
	$('#'+layerid).layer_ready(function(){
					var vskin =param.skin,$curlayer = $('#'+layerid);
					if(vskin=='skin4' || vskin=='skin5' || vskin=='skin6' || vskin=='skin7' || vskin=='skin8' || vskin=='skin9'){
							$curlayer.find('.searchtype').css({'display':'none'});
					}else $curlayer.find('.searchtype').css({'display':'block'});
					if(vskin=='skin4' || vskin=='skin5'){
					//adapt extend skin width 2014.4.27
							$curlayer.bind("fixedsearchwidth",function(e,width){
									var $target = $(this),$targetwidth = $target.find('.searchbox');
									var this_btn_width =  $target.find('.searchbox_btn').outerWidth(true);
									var this_txt_width =  $target.find('.searchbox_txt').outerWidth(true);
									$targetwidth.css({'width':this_btn_width+this_txt_width});
							}).triggerHandler("fixedsearchwidth");
					//<<<end
					}
		var dom=$('#'+layerid);
		var domhtml=dom.find('.wp-sitesearch_container').html();
		//此处将页而ID存到本地解决在新的链接窗口中获取不到值的问题
		var article_page = param.article_page;
		var product_page =param.product_page;
        dom.data('article_page',article_page);
        dom.data('product_page',product_page);

		var article_pageres = param.article_pageres;
		var product_pageres =param.product_pageres;
		dom.data('article_pageres',article_pageres);
		dom.data('product_pageres',product_pageres);

		dom.data('search_type',param.search_type);
		dom.data('sswitch',param.sswitch);
		dom.data('wordsplist',param.wordsplist);
		dom.data('openArticleUrl',param.openArticleUrl);
		dom.data('openProductUrl',param.openProductUrl);
		dom.data('search_listNum',param.search_listNum);
		dom.data('extend_content',param.extend_content);//add extend skin content
		if(domhtml.length>0){
			dom.find('.sright').off('click').on('click',function(){
				//explain:此处不知道为什么从dom对象中获取不到输入框的值，先改为$全局对象,author:fpf,date:2015-01-27,action:modify;
				//修改bug(1694)
				if(vskin == 'skin8'){
					var keywords=$.trim($(this).parent().parent().parent().find('input[name="keywords"]').val());
				} else if(vskin == 'skin9'){
                    var keywords=$.trim($(this).parent().parent().find('input[name="keywords"]').val());
                }else {
					var keywords=$.trim($(this).parent().find('input[name="keywords"]').val());
				}
				if(keywords.length == 0&&vskin!='skin8') {dom.find('input[name="keywords"]').focus();return false;}
				if(vskin=='skin8'){
					var lowprice=$.trim(dom.find('input[name="lowprice"]').val().replace(/[^0-9]/ig,""));
					if(lowprice.length == 0) {dom.find('input[name="lowprice"]').focus();return false;}
					var highprice=$.trim(dom.find('input[name="highprice"]').val().replace(/[^0-9]/ig,""));
					if(highprice.length == 0) {dom.find('input[name="highprice"]').focus();return false;}
				}

				// 根据skin4,5,6,7,8,9的设置项进行搜索
				if(searchFlag != 0 && searchFlag != 4){
					if(vskin=='skin4' || vskin=='skin5' || vskin=='skin6' || vskin=='skin7' || vskin=='skin8' || vskin=='skin9'){
						if(searchFlag == 1){
							str = 'title';
						}else if(searchFlag == 2){
							str = 'intro';
						}else if(searchFlag == 3){
							str = 'content';
						}
					}
				}else{
					var selid=new Array();
					var i=0;
					dom.find(".catetype").each(function(){
						if($(this).prop("checked")){ selid[i]=$(this).val(); i++;}

					});

					var str='';
					if(selid.length>0){
						str=selid.join(',');
					}
					if(str.length==0){ str='all'; }
				}

				var infotype=0;
				var sourcecotent=parent.$('#'+layerid).find('input[name=searchcontent]').val();
				if(sourcecotent !='article' &&sourcecotent !='product'){
					if(dom.find('.type_title').html()!=langs['Search Pro']){
						infotype=1;
					}
					if(vskin=='skin4' || vskin=='skin5' || vskin=='skin6' ||  vskin=='skin8' ||  vskin=='skin9'){
						infotype=0;
					}
				}else if(sourcecotent=='article'){
					infotype=1;
				}else if(sourcecotent=='product'){
					infotype=0;
				}



				dom.attr('infotype',infotype);
				$('body').data('wp_searchcache1','1');
				var search_type = dom.data('search_type');
				var searchskin = 2;
				if(vskin=='skin4' || vskin=='skin5' || vskin=='skin6' || vskin=='skin7' || vskin=='skin8' || vskin=='skin9'){
					if(searchFlag != 0 && searchFlag != 4){
						searchskin = 2;
					}else{
						searchskin = 1;
					}
				}
				var open = $.trim(dom.find('.wp-sitesearch_container').attr('opn'));
				if(vskin=='skin8'){ //add high low price
					var url=parseToURL('sitesearch','search',{search_listNum:dom.data('search_listNum'),openProductUrl:dom.data('openProductUrl'),search_type:dom.data('search_type'),sswitch:dom.data('sswitch'),wordsplist:dom.data('wordsplist'),openArticleUrl:dom.data('openArticleUrl'),article_page:article_page,product_page:product_page,keywords:keywords,searchskin:searchskin,lowprice:lowprice,highprice:highprice,type:str,infotype:infotype,layerid:layerid,"searchFlag":searchFlag});
				}else{
					var url=parseToURL('sitesearch','search',{search_listNum:dom.data('search_listNum'),openProductUrl:dom.data('openProductUrl'),search_type:dom.data('search_type'),sswitch:dom.data('sswitch'),wordsplist:dom.data('wordsplist'),openArticleUrl:dom.data('openArticleUrl'),article_page:article_page,product_page:product_page,keywords:keywords,searchskin:searchskin,type:str,infotype:infotype,layerid:layerid,"searchFlag":searchFlag});
				}

				var murl = '#';

				if(search_type==1){
					keywords = encodeURIComponent(keywords);
					if(infotype==1){
						if(urllist['sitesearch_artlist']) murl = urllist['sitesearch_artlist'];
					}else{
						if(urllist['sitesearch_prolist']) murl = urllist['sitesearch_prolist'];
					}

					url = murl;
					if(url!="#"){
						if(url.indexOf("?")>0){
							url = url+"&page=1&search_txt="+keywords+"&type="+str+"&searchskin="+searchskin+'&word_s='+dom.data('wordsplist');
						}else{
							url = url+"?page=1&search_txt="+keywords+"&type="+str+"&searchskin="+searchskin+'&word_s='+dom.data('wordsplist');
						}
						if(vskin=='skin8'){
							url = url+"&lowprice="+lowprice+"&highprice="+highprice;
						}
						url +='&fromid='+layerid;
					}
				}
				if(open=='1'){
					window.open(url,'_blank');
				}else{
					if(search_type==1){
						if((infotype==0 && param.openProductUrl=='1') ||
							(infotype==1 && param.openArticleUrl=='1')){
							window.open(url,'_blank');
						}else{
							window.location.href= url;
						}
					}else{
						$LAB
						.script(relativeToAbsoluteURL("plugin/sitesearch/js/sitesearch_browser.js?v=1.11111150"))
						.wait(function(){
							wp_sitesearch(url,{
								title:langs['Search Result'],
								width: 730,
								top:60
							});
						})
					}
				}
			});

			dom.find('input[name="keywords"]').keydown(function(event){
				if(event.keyCode==13){
					dom.find('.sright').trigger('click');
				}
			});

			dom.find('.type_select span').unbind('click.searchspan').bind('click.searchspan',function(){
				dom.find('.type_title').html($(this).html());
				dom.find('.type_select').hide();
				if($(this).html() ==langs['Search Pro']){
					dom.find('.s_title').html(langs['Name']);
					dom.find('.s_description').html(langs['Description']);
					$(this).html(langs['Search Art']);
					dom.find("input[name='keywords']").autocomplete("option","source",[]);
					curseachtype='product';
					getCacheType('product').done(function(arr){
						if(curseachtype=='product') dom.find("input[name='keywords']").autocomplete("option","source",arr);
					});
				}else{
					dom.find('.s_title').html(langs['Search Title']);
					dom.find('.s_description').html(langs['Search Summary']);
					$(this).html(langs['Search Pro']);
					dom.find("input[name='keywords']").autocomplete("option","source",[]);
					curseachtype='article';
					getCacheType('article').done(function(arr){
						if(curseachtype=='article') dom.find("input[name='keywords']").autocomplete("option","source",arr);
					});
				}

			});

			dom.find('.nsearch').hover(function(){
				dom.find('.type_select').show();
				dom.find('input[name="keywords"]').autocomplete("close");
			},function(){
				dom.find('.type_select').hide();
			});
			var width_xz=0;
			if($.browser.msie && $.browser.version>=9){ width_xz=4;}
			var additionwidth=0;
			var funci=0;
			var func=function(){
				if(dom.width()>dom.find('.sleft').outerWidth(true)||funci>=3){

					var domFidType = $('#'+dom.attr('fatherid')).attr('type');
					var domFidDly = $('#'+dom.attr('fatherid')+'_pop_up').css('display');
					var domFidVsl = $('#'+dom.attr('fatherid')+'_pop_up').css('visibility');

					if(param.editmode==1){
                        if(domFidType == 'pop_up' && domFidDly == 'none'){
                            $('#'+dom.attr('fatherid')+'_pop_up').css({'display':'block','visibility':'hidden'});
                        }
                    }else{
                        $('#'+dom.attr('fatherid')+'_pop_up').css({'display':'block','visibility':'hidden'});
                    }

					if(dom.find('.sright2').length) additionwidth+=dom.find('.sright2').outerWidth(true);
                    dom.find('.ninput').css({'width':(dom.width()-dom.find('.sleft').outerWidth(true)-dom.find('.sright').outerWidth(true)-additionwidth-dom.find('.nsearch').outerWidth(true)-width_xz)-4+'px'});
                    dom.find('.ninput input').width(dom.find('.ninput').width());

                    if(param.editmode==1){
                        if(domFidType == 'pop_up' && domFidDly == 'block' && domFidVsl == 'hidden'){
                        	$('#'+dom.attr('fatherid')+'_pop_up').css({'display':'none','visibility':'visible'});
                        }
					}else{
                        $('#'+dom.attr('fatherid')+'_pop_up').css({'display':'none','visibility':'visible'});
					}
				}else{
					funci+=1;
					setTimeout(func,300);
				}
			}
			func();
			//搜索按钮文字设置
		    if (vskin == 'default'||vskin == 'skin4'||vskin == 'skin7'||vskin == 'skin8' ) {
		        var extcont = dom.data('extend_content');
		        var seatext = extcont.sitesearchbuttext;
		        var pattern = /[\u4e00-\u9fa5]+/;
		        if(typeof(seatext) != 'undefined'){
		        	var sealent = seatext.length;
			        $curlayer.find('.searchbox .bcenter').text(seatext);
			        $curlayer.find('.searchbox .searchbox_btn').text(seatext);
			        if(pattern.test(seatext)) {
			          	if(vskin == 'default') {
			            	var sealent1 = (sealent>2?10*(sealent-2)+(sealent-2):0);
			                var width = $curlayer.find('.searchbox .ninput').css('width');
			                $curlayer.find('.searchbox .ninput').css({width:(parseInt(width)-sealent1)+'px'});
			                $curlayer.find('.searchbox input').css({width:(parseInt(width)-sealent1)+'px'});
			            }
			            if(vskin == 'skin7') {
			              	var sealent1 = (sealent>3?10*(sealent-3)+1:0);
			                var width = $curlayer.find('.searchbox input').css('width');
			                $curlayer.find('.searchbox input').css({width:(parseInt(width)-sealent1)+'px'});
			                var width = $curlayer.find('.searchbox .searchbox_btn').css('width');
			                $curlayer.find('.searchbox .searchbox_btn').css({width:(parseInt(width)+sealent1)+'px'});
			            }
			            if(vskin == 'skin8') {
			              	var sealent1 = (sealent>3?10*(sealent-3)+1:0);
			                var width = $curlayer.find('.searchbox .searchbox_btn').css('width');
			                $curlayer.find('.searchbox .searchbox_btn').css({width:(parseInt(width)+sealent1)+'px'});
			            }
			        }
		        }
		    }
		}
		if(!param.editmode){
					var autocomplete_width,autocomplete_date;
					if(vskin=='default' || vskin=='skin1' || vskin=='skin2' || vskin=='skin3'){
							autocomplete_width = dom.find("input[name='keywords']").parent().outerWidth()+dom.find('.searchbox').children('.sleft').outerWidth()+dom.find('.nsearch').outerWidth()
					}else{autocomplete_width = dom.find('.searchbox_txt').parent().outerWidth() }
					var wp_searchdefalut =param.sshdefalutshow;
					if(wp_searchdefalut==1){
						curseachtype='article';
					}else{ curseachtype='product'; }
					dom.data('wp_searchcache',autocomplete_date);
					// 数据量超过一千会有明显卡顿，此处现取前一千来比对	by lsf 2015/01/15
			dom.find("input[name='keywords']").autocomplete({
				source:[],
				appendTo:dom,
				width:autocomplete_width,
				open:function(event,ui){
				    if(vskin == 'skin9'){
				        var contentWidth = dom.find('.showcontent').width();
                        var inputBorderWidth = parseInt(dom.find('.showcontent').css('border-width'));
                        var contentHeight = dom.find('.showcontent').height()+2+inputBorderWidth;
                        // 22是左右内边距之和
                        $('.ui-autocomplete').css(
                            {
                                'width':contentWidth+22+inputBorderWidth*2+'px',
                                'left':-contentWidth-inputBorderWidth+'px',
                                'top':contentHeight+'px'
                            }
                        );
                    }else{
                        $('.ui-autocomplete').css('left','0');
                    }
				},
				select:function(event,ui){
					dom.find('.searchtype').prop('checked','false');
					dom.find("input[value='title']").prop('checked',true);
				}
			});
			dom.find("input[name='keywords']").one('focus',function(){
				getCacheType(curseachtype).done(function(arr){
					dom.find("input[name='keywords']").autocomplete("option","source",arr);
				});
			})
		}
		dom.data('interface_locale',getSiteCurLang());
		//explain:修复bug(1601)搜索插件的输入框在浏览器器缩放时因其宽度问题导致后面的搜索按钮不在同一行显示，现在手动减去5px以解决该问题,author:fpf,date:2015-01-20,action:modify;
		function detectZoom (){
				var ratio = 0,
				screen = window.screen,
				ua = navigator.userAgent.toLowerCase() || '';
				if (window.devicePixelRatio !== undefined) {
						ratio = window.devicePixelRatio;
				}else if (~ua.indexOf('msie')) {
						if (screen.deviceXDPI && screen.logicalXDPI) {
								ratio = screen.deviceXDPI / screen.logicalXDPI;
						}
				}else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
						ratio = window.outerWidth / window.innerWidth;
				}
				if (ratio){
						ratio = Math.round(ratio * 100);
				}
				return ratio;
		};
		var devicePixelRatios = detectZoom();
		var ischrome = navigator.userAgent.toLowerCase() || '';
		if(devicePixelRatios != 100 && ischrome.match(/chrome/)){
			var $search = dom.find('input.searchbox_txt');
			var search_width = parseFloat($search.width()).toFixed(2);
			if(search_width && search_width > 5){$search.width(search_width - 5);}
		}
	});

}

;
function layer_media_init_func(layerid,params){
	var $curlayer=$('#'+layerid), _duration = -1;
	$('#wp-media-image_'+layerid).off('mouseover').mouseover(function (event) {
		if($curlayer.data('wopop_effects') && $curlayer.hasClass('now_effecting')){
			return;
		}
		var effect=$curlayer.data('wopop_imgeffects');
		var $this=$(this);
		var running=$this.data('run');
		if(effect && running!=1){
			var effectrole = effect['effectrole'];
			var dset = effect['dset']; 
			var effectel=$curlayer;
			if(effectrole=='dantu' &&  effect['effect']=="effect.rotation"){
				$curlayer.data('iseffectrotate',true);
				effectel=$curlayer.find('.wp-media_content');
			}else if(effectrole !='dantu' && dset && dset['effect']=="effect.rotation"){
				$curlayer.data('iseffectrotate',true);
				effectel=$curlayer.find('.wp-media_content'); 
			}else if(effect['effect_on_img'] && effectrole=='dantu' &&  effect['effect']=="effect.zoomin"){
				effectel=$curlayer.find('img'); 
			}
			
			effectel.setimgEffects(true,effect,1);
			
			if(effectrole !='dantu' && typeof(dset)!="undefined"){
				// fixed bug#5949
				if ($curlayer.hasClass('now_effecting')) {
					_duration = dset.duration;
					$curlayer.wopop_effect_command('stop');
				}
				var temp_effect = {};
				temp_effect['type'] = effect['type'];
				temp_effect['effectrole'] = 'dantu';
				temp_effect['effect'] = effect['dset']['effect'];
				temp_effect['duration'] =  effect['dset']['duration'];
				effectel.setimgEffects(true,temp_effect,1);
			}
		}
	});
	// fixed bug#5949
	$curlayer.mouseleave(function(e){
		var $target = $(this), _tt = parseInt(_duration);
		if (!isNaN(_tt) && _tt >= 0 && !$target.hasClass('now_effecting')) {
			var timer = setTimeout(function(){
				$target.showEffects();
				_duration = -1;
				clearTimeout(timer);
			}, _tt);
		}
	});

	var imgover=$('#wp-media-image_'+layerid).closest('.img_over');
	imgover.children('.imgloading').width(imgover.width()).height(imgover.height());
	imgover.css('position','relative');
	$('#'+layerid).layer_ready(function(){
		layer_img_lzld(layerid);
	});
	if(!params.isedit && !params.has_effects){
		if ($('#'+$('#'+layerid).attr('fatherid')).attr('type') == 'pop_up') {
			$('#wp-media-image_'+layerid).attr('src',params.img_src);
			$('#wp-media-image_'+layerid).parents('.img_over:first').children('.imgloading').remove();
		}
	}
	
};
function wp_getdefaultHoverCss(layer_id)
{
	var getli='';
	var geta='';
	var cssstyle='';

	var navStyle = wp_get_navstyle(layer_id,'datasty_');
	if(navStyle.length > 0)
	{
		var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop:\\s*hover\\s*{[^}]+}",'i');
		var tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp1 = tmp[0].match(/{[^}]+}/)[0];
			tmp1=tmp1.replace('{','').replace('}','');
			getli=getli+tmp1;
		}
 
		patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
		tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp2 = tmp[0].match(/{[^}]+}/)[0];
			tmp2=tmp2.replace('{','').replace('}','');
			geta=geta+tmp2;
		}		
		
		
	}

	navStyle = wp_get_navstyle(layer_id,'datastys_');
	var getlia='';
	if(navStyle.length > 0)
	{		 
		var layidlow=('#nav_'+layer_id+' li.wp_subtop>a:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop>a:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestr='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestr=combilestr+ervervalue;
			}
			geta=geta+combilestr;
		}
		
		layidlow=('#nav_'+layer_id+' li.wp_subtop:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestrs='';
			for(var key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestrs=combilestrs+ervervalue;
			}
			getli=getli+combilestrs;
		}
	 
		
	}
	
	if(getli.length>0){
		getli="#"+layer_id+" li.lihover{"+getli+"} ";
	}
	if(geta.length>0){
		geta="#"+layer_id+" li>a.ahover{"+geta+"} ";
	}
	cssstyle=getli+geta;
	if(cssstyle.length>0 ){
		cssstyle=""+cssstyle+"";
		cssstyle=cssstyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
		var doms=$('#'+layer_id);
		var oldcssstyle=doms.data('get_layer_hover_css');
		if(oldcssstyle != cssstyle){
			$("#hover"+layer_id+"").text(""+cssstyle+"");
			doms.data('get_layer_hover_css',cssstyle);
			get_plugin_css("H"+ layer_id +"H",cssstyle);
		}
	}
}

function wp_showdefaultHoverCss(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_showdefaultHoverCss_'+layertype]){
		return window['wp_showdefaultHoverCss_'+layertype](layer_id);
	}
	return false;
}

function wp_showdefaultHoverCss_new_navigation(layer_id)
{
	 
	var plugin_name=$("#"+layer_id).attr('type');
	var hover=$("#"+layer_id).find('.nav1').attr('hover');
	if(hover!=1){ return;}
	
	wp_getdefaultHoverCss(layer_id);
	var n=0;
	var rootpid=0;
	if(plugin_name=='new_navigation'){
		var page_id=$("#page_id").val();
		rootpid=$("#page_id").attr("rpid")*1;
	}else{
		var page_id=$('#'+layer_id+'').find(".default_pid").html();
		if(page_id==0 || page_id.length==0){
			page_id=$('#nav_'+layer_id+'').children('li:first').attr('pid');	
		}
	}

	$('#nav_'+layer_id+'').children('li').each(function(){
		var type_pid=$(this).attr('pid');		
		if( (type_pid==page_id ) && plugin_name=='new_navigation' ){
			$(this).addClass("lihover").children('a').addClass("ahover");
		}
		if(type_pid==rootpid && rootpid>0){
			$(this).addClass('rootlihover');
		}
		var t_bool = false;
		var whref = window.location.href.replace(/^https?:/,'').replace(/&brd=1$/,'');;
		var t_href= $(this).find("a").attr("href").replace(/^https?:/,'').replace(/&brd=1$/,'');;
 		var $nav1 =  $('#'+layer_id).children('.wp-new_navigation_content').children('.nav1');
		var sethomeurl = $nav1.attr("sethomeurl");
		if(sethomeurl) sethomeurl = sethomeurl.replace(/^https?:/,'');
		var cururl = window.location.href.replace(/^https?:/,'');
		if( (whref.indexOf("&menu_id=")>0 && t_href.indexOf("id=")>0 && whref.indexOf(t_href)>-1) || t_href == sethomeurl &&  sethomeurl.indexOf(cururl)>-1 ){
			t_bool = true;
		}

		if(whref == t_href || whref== t_href+"&brd=1" || t_bool){ $(this).addClass("lihover").children('a').addClass("ahover"); }
		n++;
	});
	if(!$('#nav_'+layer_id+'').children('li.lihover').length){
		$('#nav_'+layer_id+'').children('li.rootlihover:first').addClass("lihover").children('a').addClass("ahover");
	}
	$('#nav_'+layer_id+' .rootlihover').removeClass('rootlihover');
}
function wp_nav_addMoreButton(layer_id)
{  
	var type_style=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
	
	var index=0;
	var exec=false;
	var func=function(){
		if(!$('#scroll_container #'+layer_id+':visible').length){
			$("#"+layer_id).unbind('more_button_event').bind('more_button_event',function(){
				index=0;
				func();
			})
			if(index<=20){
				setTimeout(func,500);
				index++;
			}
			return;
		}
		if(exec) return;
		$("#"+layer_id).unbind('more_button_event');
		exec=true;

		var firstLiTop = 0;
		var hasMore = false;
		$('#scroll_container  #nav_'+layer_id).children('li.wp_subtop').each(function(i){
			if(i == 0) {firstLiTop = $(this).offset().top;return true;}	
			if($(this).offset().top > firstLiTop)
			{
				if(i==1){
					var twice=$("#"+layer_id).data('twiced');
					if(!twice){
						$("#"+layer_id).data('twiced',true);
						setTimeout(func,1500);
						return false;
					}
				}	

				if(type_style==2){
					$(this).remove();
				}else{

				$('#'+layer_id).data('hasMore','yes');//配置逻辑获取
				var more = $.trim($('#'+layer_id).children('.wp-new_navigation_content').children('.nav1').attr('more'));
				var doms = $(this).prev().prev().nextAll().clone();
				var objA = $(this).prev().children('a');
				if(objA.children('span').length > 0) objA.children('span').html(more);
				else objA.html(more);

				if(objA.hasClass('sub'))
				{
					objA.next('ul').empty();
					doms.appendTo(objA.next('ul'));
				}
				else
				{
					objA.after('<ul></ul>');
					doms.appendTo(objA.next('ul'));
					objA.addClass('sub');
				}
				objA.addClass('nav_more_link');
				$(this).prev().nextAll().remove();
				objA.next('ul').children('li').removeClass('wp_subtop').removeClass('lihover').children('a').removeClass("ahover");
				hasMore = true;
				
				objA.attr('href','javascript:void(0);');

				//点击"更多"弹出全站导航
				if($("#"+layer_id).find('.nav1').attr('moreshow') == 1)
				{
					$(document).undelegate("#"+layer_id+" .nav_more_link",'click').delegate("#"+layer_id+" .nav_more_link",'click',function (e){
						var func=function(){
							$('#'+layer_id).find('#basic-modal-content_'+layer_id).modal({
								containerId:'wp-new_navigation-simplemodal-container_'+layer_id,
								zIndex:9999,
								close:false,
								onOpen:function(dialog){
									dialog.overlay.fadeIn('slow', function(){
										dialog.container.slideDown('slow',function(){
											dialog.data.fadeIn('slow','swing',function(){
												$('.wp_menus').not('.wp_thirdmenu0').each(function(){
													var left = $(this).parent().parent().children('a').eq(0).outerWidth()+5;
													$(this).css({position:'relative',left:left+'px'});
												});
											});
										});
									});
								},
								onClose:function(dialog){
									dialog.data.fadeOut('slow',function (){
										dialog.container.slideUp('slow', function () {
											dialog.overlay.fadeOut('slow', function () {
												$.modal.close();
											});
										});
									});
								}
							});
						}
						if($('#'+layer_id).find('#basic-modal-content_'+layer_id).length){
							func();
						}else{
							var morediv=$('#'+layer_id).find('.navigation_more');
							var more_color=morediv.attr('data-more');
							var typeval=morediv.attr('data-typeval');
							var menudata=morediv.attr('data-menudata');
							$.ajax({
								type: "POST",
								url: parseToURL("new_navigation", "windowpopup"),
								data: {layer_id:layer_id,color:more_color,typeval:typeval,menudata:menudata},
								success: function (response) {
									if (response == 'Session expired')
										window.location.href = getSessionExpiredUrl();
									morediv.replaceWith(response);
									func();
								},
								error: function (xhr, textStatus, errorThrown) {
									wp_alert(xhr.readyState + ',' + xhr.status + ' - ' + (errorThrown || textStatus) + "(get nav).<br/>" + translate("Request failed!"));
									return false;
								}
							});
						}
						return false;
					});
				
				}
				return false;
				}
			}
		});
		if(!hasMore) $('#'+layer_id).data('hasMore','no');
		wp_showdefaultHoverCss(layer_id);
	};
	func();
}

//编辑模式水平拖动动态刷新修改More按钮
function wp_updateMoreButton(layer_id)
{
	var $layer = $('#'+layer_id);
	var $nav1 = $layer.children('.wp-new_navigation_content').children('.nav1');
	var tmp_css = $.trim($("#datastys_"+layer_id).text());
	var tmp_cssa = $.trim($("#datasty_"+layer_id).text()); 
	$.post(parseToURL("new_navigation","refreshNavigator",{menustyle:$.trim($nav1.attr('skin')),saveCss:'yes',page_id:$("#page_id").val(),blockid:layer_id,typeval:$.trim($layer.find(".wp-new_navigation_content").attr('type')),colorstyle:$.trim($nav1.attr('colorstyle')),direction:$.trim($nav1.attr('direction')),more:$.trim($nav1.attr('more')),hover:$.trim($nav1.attr('hover')),hover_scr:$.trim($nav1.attr('hover_scr')),umenu:$.trim($nav1.attr('umenu')),dmenu:$.trim($nav1.attr('dmenu')),moreshow:$.trim($nav1.attr('moreshow')),morecolor:$.trim($nav1.attr('morecolor')),smcenter:$.trim($nav1.attr('smcenter'))}),{"addopts": $layer.mod_property("addopts")||{},menudata:$("#"+layer_id).data("menudata")},function(data){
		$layer.find('.wp-new_navigation_content').html(data);		
		$("#datastys_"+layer_id).text(tmp_css);
		get_plugin_css(layer_id,tmp_cssa+" "+tmp_css);
	});
	wp_showdefaultHoverCss(layer_id);
}

function wp_removeLoading(layer_id)
{
	
	var $nav1 = $('#'+layer_id).find(".nav1");
	var ishorizon=$nav1.attr("ishorizon");
	if(ishorizon=='1'){
		$("#"+layer_id).find('.wp-new_navigation_content').css({height:'auto',overflow:'hidden'});
	}else{
		$("#"+layer_id).find('.wp-new_navigation_content').css({width:'auto',overflow:'hidden'});
	}
	// 修复IE浏览器部分版本导航无法显示问题 2013/12/26
 
	var temptimer = setTimeout(function(){
		$("#"+layer_id).find('.wp-new_navigation_content').css("overflow", 'visible');
		clearTimeout(temptimer);
	}, 50);
}

function richtxt(layer_id)
{
	var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
	if(type==2){
		var baseloop = 0;
		 $("#"+layer_id).find('.ddli').each(function(){
			 $(this).addClass("setdiff"+baseloop);
			 baseloop++;
		 });
	}
}

function wp_createNavigationgetSubMenuHoverCssFunc(param){
	var layer_id=param.layer_id;
	var editmode=param.editmode;
	function getSubMenuHoverCss(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		if(editmode){
			var navStyle = $.trim($("#datastys_"+layer_id).text());
		}else{
			var navStyle = $.trim($("#"+layer_id).data("datastys_"));
		}
		if(navStyle.length > 0){
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		if(editmode){
			navStyle = $.trim($("#datasty_"+layer_id).text());
		}else{
			navStyle = $.trim($("#"+layer_id).data("datasty_"));
		}
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);

			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}
		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	}
	window[layer_id+'_getSubMenuHoverCss']=getSubMenuHoverCss;
}

function layer_new_navigation_content_func(params){
	var layer_id = params['layer_id'];
	$("#"+layer_id).find('.menu_hs11').css('visibility','hidden');
    var contentfunc=function(){
        if($("#"+layer_id).is(':visible')){
                $("#"+layer_id).find('.wp-new_navigation_content').each(function(){
                  var wid = $(this).width();
                  var liwid = $(this).find('li:eq(0)');
				  var lipadd = parseInt(liwid.css('padding-right'))+parseInt(liwid.css('padding-left'));
				  var isEmptyMenu=false;
				  if($(this).find('li.wp_subtop').length==1){
					  var menulinktxt=$(this).find('li.wp_subtop a').text();
					  if(menulinktxt=='No menu!'){
						 isEmptyMenu=true;
					  }
				  }
                  if (!isEmptyMenu && $.inArray(params.menustyle, ['hs7','hs9','hs11','hs12']) != -1) {
					  var bwidth = parseFloat(liwid.css("borderRightWidth") || '0');
					  if(bwidth>0) bwidth=parseInt(bwidth + 0.1);
					  else bwidth =0;
					  $('li.wp_subtop', this).css('box-sizing','');
					  if(bwidth > 0) $('li.wp_subtop', this).width(function(i, h){return h - bwidth - 1});
					  else if(!$("#canvas").data('changewidth_'+layer_id)){
						  $("#canvas").data('changewidth_'+layer_id,true);
						  if(params.menustyle=='hs12'){
						  	$('li.wp_subtop', this).width(function(i, h){return h - 1})
						  }else{
							var totalw=0;
							$('li.wp_subtop', this).width(function(i, h){totalw+=h;return h})
							var ulwidth=$(this).find('#nav_'+layer_id).width();
							if(totalw>ulwidth){
								for(var i=0;i<totalw-ulwidth;i++){
								 	$('li.wp_subtop:eq('+i+')', this).width(function(i, h){return h - 1});
								}
							}
						  }
					  };
				  }
                  if(parseInt(liwid.width())>(wid-lipadd)){
					$(this).find('li.wp_subtop').css('width',wid-lipadd);
                  }
                });
                $("#"+layer_id).find('.menu_hs11,.menu_hs7,.menu_hs12').css('visibility','');
                var contenth=$("#"+layer_id+" .wp-new_navigation_content").height();
                if(contenth==0){
                    $("#"+layer_id+" .wp-new_navigation_content").css('height','');
                }
         }else{
                 setTimeout(contentfunc,60);
         }
    }
	contentfunc();
		if(params.isedit){$('#'+layer_id).mod_property({"addopts": params.addopts});}
	if((params.addopts||[]).length > 0 && /^hs/i.test(params.menustyle)){$('#nav_'+layer_id+' li.wp_subtop:last').css("border-right", 'none');}
    if(! params.isedit){
        if($.inArray(params.menustyle, ['vertical_vs6','vertical_vs7']) != -1){
            var $layer=$('#'+layer_id).find(".wp-new_navigation_content");
            var vswidth=$layer.width();
            var $ul=$layer.find('ul.navigation');
            $ul.css({width:vswidth+'px'});
            $ul.find("li.wp_subtop").css({width:(vswidth-14)+'px'});
        }
    }
};
function layer_new_navigation_hs9_func(params){
	var layer_id = params['layer_id'],
	menustyle = params.menustyle;
    if($('#'+layer_id).find(".wp-new_navigation_content").length > 0){
        $('#'+layer_id).find(".wp-new_navigation_content").css("height","auto");
    }
	window[layer_id+'_liHoverCallBack'] = function(){
		$(".menu_"+menustyle+" #nav_"+layer_id+" li").hover(function(){
			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				if($(this).hasClass('wp_subtop')) $(this).parent().css('z-index',resizehandle+1);
				var canvas_zindex = $('#canvas').css('z-index');
				var $toolbar = $(".propblk[super='"+layer_id+"']");
				if($toolbar.length > 0)  $toolbar.css('z-index',canvas_zindex - 1);
			}
			$(this).children("ul").css("left", "0px").show();
		},function(){
			$(this).children("ul").hide();

			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				var isHover = true;
				$('#nav_'+layer_id).find('ul').each(function(){
					if($(this).css('display') != 'none') isHover = false;
					return false;
				});
				if(isHover){
					if(!($.browser.msie && $.browser.version < 9)) $(this).parent().css('z-index',resizehandle-1);
				}				
			}

		});

	};
	
	window[layer_id+'_getSubMenuHoverCss'] = function(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else if(typeval == 2){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else if(typeval == 3){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		
		var navStyle = wp_get_navstyle(layer_id, 'datastys_');
		if(navStyle.length > 0)
		{
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		navStyle = wp_get_navstyle(layer_id, 'datasty_');
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else if(typeval == 2){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*{[^}]+}",'i');
			}else if(typeval == 3){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);
			
			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}

		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	};
	
	$('#'+layer_id).layer_ready(function(){
		window[layer_id+'_liHoverCallBack']();

		//第三级即下级菜单随高度增加位置动态修改
		$('#'+layer_id+' .menu_'+menustyle+' li').hover(function(){
			$(this).children('ul').css('top',$(this).outerHeight());
		});
		
		$("#"+layer_id+" li").hover(function(){ 			
				var thisleft=$(this).offset().left;
				var thiswidth=$(this).outerWidth();	
				//父中心点坐标
				var thiswidthcenter=0;
				//子中心点坐标
				var thischildwidthcenter=0;			
				var orgleft = $("#"+layer_id).offset().left;
				var orgright = $("#"+layer_id).outerWidth();
				orgright=orgright+orgleft;
				thiswidthcenter=thisleft+thiswidth/2;

				//计算子菜单总宽度
				var childlidom=$(this).children('ul').children('li');
				var childliwidth=0;
				childlidom.each(function(){
					childliwidth=childliwidth+$(this).outerWidth();			
				});
				
				thischildwidthcenter=childliwidth/2;			
				var chavalue=thiswidthcenter-thischildwidthcenter;
				var charightvalue=thiswidthcenter+thischildwidthcenter;			
				
				var ulwidth=$("#"+layer_id).width();
				if(chavalue<orgleft && charightvalue>orgright){ 
					//超出边界不做处理			
				}else{
					if(chavalue>orgleft && charightvalue<orgright){
						$(this).children("ul:eq(0)").css("padding-left", (chavalue-orgleft)+"px");				
						if(ulwidth>0){
							$(this).children("ul:eq(0)").css("width", (ulwidth-chavalue+orgleft)+"px");
						}	
					}else{
						if(chavalue>orgleft && charightvalue>orgright){
							$(this).children("ul:eq(0)").css("padding-left", (ulwidth-childliwidth-2)+"px");
							if(ulwidth>0){
								if(childliwidth>ulwidth) childliwidth=ulwidth;
								$(this).children("ul:eq(0)").css("width", (childliwidth+2)+"px");
							}
						}
					}		
				}
				
				if(!$(this).hasClass('wp_subtop'))
				{
					$(this).css('background-image',window[layer_id+'_getSubMenuHoverCss']('background-image',3));
					$(this).css('background-repeat',window[layer_id+'_getSubMenuHoverCss']('background-repeat',3));
					$(this).css('background-color',window[layer_id+'_getSubMenuHoverCss']('background-color',3));
					$(this).css('background-position',window[layer_id+'_getSubMenuHoverCss']('background-position',3));
				}
				if($(this).children('ul').length > 0)
				{
					$(this).children('ul').css('background-image',window[layer_id+'_getSubMenuHoverCss']('background-image',2));
					$(this).children('ul').css('background-repeat',window[layer_id+'_getSubMenuHoverCss']('background-repeat',2));
					$(this).children('ul').css('background-color',window[layer_id+'_getSubMenuHoverCss']('background-color',2));
					$(this).children('ul').css('background-position',window[layer_id+'_getSubMenuHoverCss']('background-position',2));

					$(this).children('ul').children('li').css({'background-image':'none','background-color':'transparent'});
				}
				var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
				if(type==2){
					var self = $(this);
					var pos = 0 ;
					var loops = 0;
					$('#nav_'+layer_id).find('li').each(function(){
						if(loops == 1) return true;
						if(self.html() == $(this).html()){
							loops = 1;
							return true;
						}else{
							pos = pos + $(this).outerWidth();
						}	
						 
					})
					 
					$("#"+layer_id).find('.ddli').hide();
					var this_width = $('#nav_'+layer_id).outerWidth();
					var thisul_left = $('#nav_'+layer_id).css("padding-left");
					thisul_left = parseInt(thisul_left);
					$(this).children('.ddli').outerWidth(this_width).css("margin-left","-"+(thisul_left+pos)+"px");
					$(this).children('.ddli').eq(0).slideDown();
				}			
	 
		},function(){ 
				if(!$(this).hasClass('wp_subtop'))
				$(this).css({'background-color':'transparent','background-image':'none'});
				$(this).children("ul:eq(0)").css("left", "-99999px").hide(); 
				if(params.isedit){
					var isHover=true;
					$('#nav_'+layer_id).find('ul').each(function(){
						if($(this).css('display') != 'none') {isHover = false;}
					});
					if(isHover){			 
						var $toolbar = $(".propblk[super='"+layer_id+"']");
						if($toolbar.length > 0)  $toolbar.css('z-index','999');
					}	
				}
				var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
				if(type==2){
					$("#"+layer_id).find('.ddli').slideUp();
				}
		});

		$('.menu_'+menustyle+' #nav_'+layer_id).find('li').hover(function(){
			var direction=$("#"+layer_id).find('.nav1').attr('direction');
			var height = parseInt($(this).outerHeight());
			if(direction==1){				
				$(this).children('ul').css('top','auto').css('bottom',height + 'px');
			}else{				
				$(this).children('ul').css('top',height+'px').css('bottom','auto');	
			}
			if($(this).parent().hasClass('navigation'))
			{			
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",0),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",0),'color':window[layer_id+'_getSubMenuHoverCss']("color",0),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",0),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",0)});
			}else{			
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",1),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",1),'color':window[layer_id+'_getSubMenuHoverCss']("color",1),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",1),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",1)});
			}
			if($(this).parent().hasClass('navigation'))
			{
				$('#nav_'+layer_id+' .wp_subtop').removeClass("lihover").children('a').removeClass("ahover");
			}
		},function(){
			if($(this).parent().hasClass('navigation'))
			{
				wp_showdefaultHoverCss(layer_id);
			}
			 $(this).children('a').attr("style",'');
		});
		wp_showdefaultHoverCss(layer_id);
		var is_exec=false;
		var func=function(){
			if(!is_exec){
				wp_removeLoading(layer_id);
				is_exec=true;
			}
		};
		$(function(){
			func();
		});
		
	});
};
function detectZoom (){ 
    var ratio = 0,
    screen = window.screen,
    ua = navigator.userAgent.toLowerCase() || '';
    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    }else if (~ua.indexOf('msie')) {  
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    }else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }
    if (ratio){
        ratio = Math.round(ratio * 100);
    }
    return ratio;
}

function layer_unslider_heightAdapt_func(dom,params){
	var wsize=params.wsize;
	if(params.unslideradapt!='1') return;
	if(!wsize || !wsize.width) return;
	if(params.editMode) return;
	var lastW=dom.data('lastW');
	var winW=dom.find('.wp-unslider_content').width();
	dom.data('lastW',winW);
	if(winW==lastW) return;
	var curH=dom.height();
	var editH=parseInt(wsize.height)
	if(wsize.width>=winW && curH<=editH) return;
	var curH=editH;
	if(wsize.width<winW) curH=parseInt(curH*winW/wsize.width);
	dom.css('height',curH+'px');
	dom.find('.wp-unslider_content').css('height',curH+'px');
	var adaptfunc=function(){
		var heightfunc=function(){
			return editH;
		}

		var layer_first_div=function(el){
			var firstdiv=el.children('div').eq(0);
			return firstdiv;
		}
		
		var resetPos=function(el){
			var oritop=el.data('adaptoritop');
			var oriheight=el.data('adaptoriheight');
			var pressArr=el.data('adaptpress');
			var wrapArr=el.data('adaptwrap');
			var id=dom.prop('id');
			var toppos=$.parseInteger(el.css('top'));
			if(el.data('wopop_effect_oristyle')){
				var style=el.data('wopop_effect_oristyle');
				var topregexp=/(?:^|;)\s*top\s*:\s*(\d+)px/;
				var topmatches=style.match(topregexp);
				if(topmatches){
					toppos=parseInt(topmatches[1]);
				}
			}
			if(!oritop&&oritop !==0){
				el.data('adaptoritop',toppos);
				el.data('adaptoriheight',el.height());
				return;
			}

			if(pressArr && pressArr.length){
				var newpressarr=[]
				for(var i=0;i<pressArr.length;i++){
					var press=pressArr[i];
					if(press.id !=id){
						oritop+=press.diffY;
						newpressarr.push(press)
					}
				}
				el.data('adaptpress',newpressarr);
			}
			
			if(wrapArr && wrapArr.length){
				var h=oriheight;
				for(var i=0;i<wrapArr.length;i++){
					var wrap=wrapArr[i];
					if(wrap.id !=id){
						h+=wrap.diffH;
					}
				}
				if(h!=el.height()){
					el.css('height',h+'px');
					var wrapListPadding = parseInt(layer_first_div(el).css('padding-top')) + parseInt(layer_first_div(el).css('padding-bottom'));
					var wrapListBorder = parseInt(layer_first_div(el).css('border-top-width')) + parseInt(layer_first_div(el).css('border-bottom-width'));
					layer_first_div(el).height(el.height() - wrapListPadding - wrapListBorder);
				}
			}
			if(oritop!=toppos){ 
				if(el.data('wopop_effect_oristyle')){
					var style=el.data('wopop_effect_oristyle');
					style=style.replace(/((?:^|;)\s*top\s*:\s*)\d+px;/,'$1'+oritop+'px;');
					el.data('wopop_effect_oristyle',style);
				}
				el.css('top',oritop+'px');
			}
		}
		
		var canvheight=$('#canvas').data('adaptoriheight');
		if(!canvheight){
			$('#canvas').data('adaptoriheight',$('#canvas').height());
			canvheight=$('#canvas').data('adaptoriheight');
		}
		var adaptModuleBefore = heightfunc();//自适应之前原始高度
		resetPos(dom);
		//有些模块第一个元素不是div，比如：产品详情
		var adaptModuleAfter = curH;//自适应之后高度

		//bug 7531 特殊处理  限定mbox内 且高度差不高于10
		var adaptdoms=$('#canvas').data('heightadaptdoms');
		if(!adaptdoms) adaptdoms=[];
		var domfatherid=dom.attr('fatherid');
		var sameTopDiff=0;
		if(domfatherid&&domfatherid!=''&&domfatherid!='canvas' && domfatherid!='site_footer'){
			adaptdoms.push({id:dom.prop('id'),diff:adaptModuleAfter-adaptModuleBefore});
			$('#canvas').data('heightadaptdoms',adaptdoms);
		}

		var moduleLayerHeight = adaptModuleBefore;
		var moduleHeight = layer_first_div(dom).outerHeight();//模块取 wp-模块名_content层的高度
		
		var moduleTop = dom.ab_pos_cnter('top');//获取画布坐标系y值
		
		var left_boundray = 0;//左右边界
		var right_boundray = $('#canvas').width();
		
		var offsetY = 0;//发生重合后往下压位置与高度自适应模块空出原有高度
		var pressList = new Array();//记录往下压的模块列表
		var wrapList = new Array();//包在高度自适应外层模块列表
		
		var minTop = 0,minId = 0;
		//页面上的模块可能有不同坐标系，但往下压多少像素的相对偏移量都相同的，获取这些偏移量
		var diffY = 0;//向下移动偏移量
		
		$("#canvas").find('.cstlayer,.full_column').each(function(){
			//判断页面模块是不是在高度自适应模块左右边界中,通栏模块肯定在,不需要判断
			resetPos($(this));
			var tmp_left = $(this).ab_pos_cnter('left');
			var tmp_top =$(this).ab_pos_cnter('top'),tmp_width = $(this).outerWidth(),tmp_height = $(this).outerHeight();
			if($(this).data('wopop_effect_oristyle')){
				var style=$(this).data('wopop_effect_oristyle');
				var topregexp=/(?:^|;)\s*top\s*:\s*(\d+)px/;
				var topmatches=style.match(topregexp);
				if(topmatches){
					var toppos=parseInt(topmatches[1]);
					tmp_top=tmp_top-parseInt($(this).css('top'))+toppos;
				}
			}
			if($(this).hasClass('cstlayer'))
			{
				if(tmp_left + tmp_width < left_boundray) return true;
				if(tmp_left > right_boundray) return true;
				if(dom.attr('id') == $(this).attr('id'))  return true;//自己除外
				//包在高度自适应模块外面的模块也要改变高度
				if((tmp_left <= left_boundray && tmp_left+tmp_width >= right_boundray) && (tmp_top <= moduleTop && tmp_top+tmp_height >= moduleTop+moduleLayerHeight))
				{
					wrapList.push($(this).attr('id'));
					return true;
				}
			}
			if($(this).parent().hasClass('full_content') || $(this).parent().hasClass('footer_content') || $(this).parent().hasClass('drop_box')) return true;//通栏和底部元素暂时不考虑
			if(tmp_top >= (moduleTop + moduleLayerHeight))
			{
				pressList.push($(this).attr('id'));
				if(minTop == 0) {minTop = tmp_top;minId = $(this).attr('id');}
				else
				{
					if(minTop > tmp_top) {minTop = tmp_top;minId = $(this).attr('id');}
				}
			}
		});
		//ceshi
		offsetY = $("#"+minId).ab_pos_cnter('top') - (moduleTop + moduleLayerHeight);

		if(pressList.length > 0 && (moduleTop + moduleHeight) >= minTop)
		{
			diffY = moduleTop + moduleHeight + offsetY - minTop;
			for(var i = 0;i < pressList.length;i++)
			{
				var theel=$("#"+pressList[i]);
				var eltop=parseInt(theel.ab_pos_cnter('top'))+diffY-sameTopDiff;
				theel.css('top',eltop+'px');
				//bug 5996 自适应导致模块style变化了，动画出错
				if(theel.data('wopop_effect_oristyle')){
					var style=theel.data('wopop_effect_oristyle');
					style=style.replace(/((?:^|;)\s*top\s*:\s*)\d+px;/,'$1'+eltop+'px;');
					theel.data('wopop_effect_oristyle',style);
				}
				var pressArrOld=theel.data('adaptpress');
				if(!pressArrOld) pressArrOld=[];
				var pressArr=[];
				for(var j=0;j<pressArrOld.length;j++){
					if(pressArrOld[j].id != dom.prop('id')) pressArr.push(pressArrOld[j]);
				}
				pressArr.push({id:dom.prop('id'),diffY:diffY-sameTopDiff});
				theel.data('adaptpress',pressArr);
			}
		}
		
		if(wrapList.length > 0)
		{
			for(var i = 0;i < wrapList.length;i++)
			{
				var diffH=moduleHeight-moduleLayerHeight;
				var theel=$("#"+wrapList[i]);
				theel.height($("#"+wrapList[i]).height()+(diffH));
				var wrapListPadding = parseInt(layer_first_div(theel).css('padding-top')) + parseInt(layer_first_div($("#"+wrapList[i])).css('padding-bottom'));
				var wrapListBorder = parseInt(layer_first_div(theel).css('border-top-width')) + parseInt(layer_first_div($("#"+wrapList[i])).css('border-bottom-width'));
				layer_first_div(theel).height(theel.height() - wrapListPadding - wrapListBorder);
				var wrapArrOld=theel.data('adaptwrap');
				if(!wrapArrOld) wrapArrOld=[];
				var wrapArr=[];
				for(var j=0;j<wrapArrOld.length;j++){
					if(wrapArrOld[j].id != dom.prop('id')) wrapArr.push(wrapArrOld[j]);
				}
				wrapArr.push({id:dom.prop('id'),diffH:diffH});
				theel.data('adaptwrap',wrapArr);
				// fixed bug#4119 - Add 'custom-listener-event'
				var events = theel.data("events") || {};
				if (events.hasOwnProperty("wrapmodheightadapt"))
					theel.triggerHandler("wrapmodheightadapt");
			}
		}
		
		var nowcanvheight=$('#canvas').height();
		if(nowcanvheight != canvheight) $('#canvas').css('height',canvheight);
		setTimeout(function(){
			scroll_container_adjust();
		},100);
	}
	$(document).ready(function(){
		adaptfunc();
	})
}

function layer_unslider_init_func(params){
    var layerid = params.layerid;
    var module_height =params.module_height;
	if (layerid.length == 0) return;
	var layerel=$('#'+layerid);
    //Set module height start
    if(module_height && parseInt(module_height)){
        $('#'+layerid).css('height',module_height+'px').removeAttr('module_height');
        $('#'+layerid+' .wp-resizable-wrapper').css('height',module_height+'px');
    }//Set module height end
	var $content = $('#'+layerid+'_content');
	var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
	$content.css("border", params.pstyle);
	var fullparent = $content.parents('.fullpagesection').length;
	var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
	if(fullparent) { cnvpos.left = Math.abs($('.fullpagesection').css('left').replace('px','')); }
	cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
	var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
	if(fullparent) { canwidth = $(window).width(); }
	if(cnvpos.left<0) cnvpos.left=0;
	$content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});
	$('#'+layerid).css({left: '0',width: $('#canvas').width()});
	$('#'+layerid+' .banner').css("min-height", cntheight+'px'); $('#'+layerid+' .banner').css("height", cntheight+'px');
	$('#'+layerid+' .bannerul').css("height", cntheight+'px');
	$('#'+layerid+' .banner ul li').css("min-height", cntheight+'px').css('width',($('#scroll_container_bg').width() - borderwidth)+'px');$('#'+layerid+' .banner ul li').css("height", cntheight+'px');
	$('#'+layerid+' .banner .inner').css("padding", cntheight/2+'px 0px');
	var titlebarfunc=$.noop;
	var wsizefunc=function(h){
		if(params.unslideradapt!='1') return;
		if(params.editMode) return;
		var $content = $('#'+layerid+'_content');
		var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
		var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
		cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
		var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
		if(cnvpos.left<0) cnvpos.left=0;
		$content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});
		layer_unslider_heightAdapt_func($('#'+layerid),params)
		cntheight = $content.parent().height() - borderwidth;
		h.options.height=cntheight;
		h.createStyle();
		h.container.css("width","100%");
		h.options.navmarginy=cntheight-39;
		$('#'+layerid).trigger('changenavpos');
		titlebarfunc();
	}
	$('#'+layerid).data('wsize_func',wsizefunc);
	$('#'+layerid).layer_ready(function(){
		var ctrldown = false;
		$(window).resize(function(){
				if(!ctrldown){
					var func=function(){
						var $content = $('#'+layerid+'_content');
						var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
						var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
						cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
						var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
						if(cnvpos.left<0) cnvpos.left=0;
						$content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});
					}
					setTimeout(func,0);
					$('#scroll_container_bg').one('after_resize',function(){
						func();
					});
				}
		})
		$(window).keydown(function(event){
				if(!event.ctrlKey){
					var $content = $('#'+layerid+'_content');
					var bsize =(params.pstyle != 'none') ? params.plborder_size : '0';
					var borderwidth = 2 * parseInt(bsize),cntheight = $content.parent().height() - borderwidth,cnvpos = $('#canvas').offset();
					cnvpos.left += $._parseFloat($('#canvas').css("borderLeftWidth")) + $('#scroll_container').scrollLeft();
					var canwidth = $('#scroll_container_bg').width()<$('#canvas').width()?$('#canvas').width():$('#scroll_container_bg').width();
					if(cnvpos.left<0) cnvpos.left=0;
					$content.css({left: (0-cnvpos.left)+'px',width: (canwidth - borderwidth)+'px',height: cntheight+'px'});

				}else{
					ctrldown = true;
				}
		})
	})
	$('#'+layerid).layer_ready(function(){
        var transitionstr=params.easing;
        var transitiononfirstslide='';
		if(params.easing=='all'){
			transitionstr=($.browser.msie) ? "slide,slice,blocks,blinds,fade,shrink" : "slide,slice,blocks,blinds,shuffle,threed,fade,shrink";
		}
		if(transitionstr == 'shrink') {
		    transitiononfirstslide = 'shrink';
        }
		if(params.default_show=='1'){
			var arrow_show='always';
		}
		if(params.hover_show=='1'){
			var arrow_show='mouseover';
		}

		layer_unslider_heightAdapt_func($('#'+layerid),params)

			var $content = $('#'+layerid +' #'+layerid +'_content');
			var cntheight = $content.parent().height();
			cntheight = $('#'+layerid+' .wp-unslider_content').height();
			if(cntheight=='') cntheight=267;
			var  cnpos = $('#'+layerid+' .wp-unslider_content').offset();
			var contentpos = (cntheight)-39;
			if(!params.arrow_left){
				var arrow_left='template/default/images/left_arrow.png';
			}else{
				var arrow_left=params.arrow_left;
			}
			if(!params.arrow_right){
				var arrow_right='template/default/images/right_arrow.png';
			}else{
				var arrow_right=params.arrow_right;
			}
			var scripts = document.getElementsByTagName("script");
			var jsFolder = "";
			for (var i= 0; i< scripts.length; i++)
			{
					if( scripts[i].src && scripts[i].src.match(/lovelygallery\.js/i))
					jsFolder = scripts[i].src.substr(0, scripts[i].src.lastIndexOf("/") + 1);
			}

			var navW=12;var navH=12;
			if(params.iconstyle=='style1'){
				navW=20;navH=params.nav_height_size;
			}
			$LAB
			.script(relativeToAbsoluteURL('plugin/unslider/js/html5zoo.js?v=23')).wait(function(){
				if($('#'+layerid).data('wp_htmlzoo')) return;
				$('#'+layerid).data('wp_htmlzoo',true);
				var win_width = $('#scroll_container_bg').width();
				jQuery("#"+layerid+"html5zoo-1").html5zoo({
					jsfolder:jsFolder,
					transitiononfirstslide:transitiononfirstslide,
					width:win_width,height:cntheight,
					skinsfoldername:"",loadimageondemand:false,isresponsive:false,
					addmargin:true,randomplay:false,
					slideinterval:params.interval,     // 控制时间
					loop:0,
					autoplay:params.autoplays=='false'?false:true,
					skin:"Frontpage",
					navbuttonradius:0,
					navmarginy:contentpos,showshadow:false,
					navcolor:"#999999",
					texteffect:"fade",
					navspacing:12,
					arrowtop:50,
					textstyle:"static",
					navpreviewborder:4,
					navopacity:0.8,
					shadowcolor:"#aaaaaa",
					navborder:4,
					navradius:0,
					navmarginx:16,
					navstyle:"bullets",
					timercolor:"#ffffff",
					navfontsize:12,
					navhighlightcolor:"#333333",
					navheight:navH,navwidth:navW,
					navshowfeaturedarrow:false,
					titlecss:"display:block;position:relative;font:"+params.title_size+"px "+params.title_family+"; color:"+params.title_color+";",//font style
					arrowhideonmouseleave:500,
					arrowstyle:params.skin=='01'?'none':arrow_show,
					texteffectduration:win_width,
					border:0,
					timerposition:"bottom",
					navfontcolor:"#333333",
					borderradius:0,
					textcss:"display:block; padding:12px; text-align:left;",
					navbordercolor:"#ffffff",
					textpositiondynamic:"bottomleft",
					ribbonmarginy:0,
					ribbonmarginx:0,
					unsliderheight:cntheight,
					unsliderlid:layerid,
					arrowimage_left:arrow_left,
					arrowimage_right:arrow_right,
                    nav_arrow_w_size:params.nav_arrow_w_size,
                    nav_arrow_h_size:params.nav_arrow_h_size,
					navigation_style:params.navigation_style,
					navbg_hover_color:params.navbg_hover_color,
					nav_margin_bottom:params.nav_margin_bottom_size,
					nav_arrow:params.nav_arrow,
					nav_margin_left:params.nav_margin_left_size,
					nav_margin_right:params.nav_margin_right_size,
					skin:params.skin,
					pauseonmouseover:params.pauseonmouseover=='1'?true:false,
					slide: {
                        duration:win_width,
                        easing:"easeOutCubic",
                        checked:true
					},
					shrink: {
						duration:params.interval, // 缩放特效 持续时间配置
						easing:"easeOutCubic",
						scale:1.1, // 缩放特效 初始放大倍数配置
						checked:true
					},
					crossfade: {
                        duration:win_width,
                        easing:"easeOutCubic",
                        checked:true
					},
					threedhorizontal: {
                        checked:true,
                        bgcolor:"#222222",
                        perspective:win_width,
                        slicecount:1,
                        duration:1500,
                        easing:"easeOutCubic",
                        fallback:"slice",
                        scatter:5,
                        perspectiveorigin:"bottom"
					},
					slice: {
                        duration:1500,
                        easing:"easeOutCubic",
                        checked:true,
                        effects:"up,down,updown",
                        slicecount:10
					},
					fade: {
                        duration:win_width,
                        easing:"easeOutCubic",
                        checked:true,
                        effects:"fade"
					},
					blocks: {
                        columncount:5,
                        checked:true,
                        rowcount:5,
                        effects:"topleft,bottomright,top,bottom,random",
                        duration:1500,
                        easing:"easeOutCubic"
					},
					blinds: {
                        duration:2000,
                        easing:"easeOutCubic",
                        checked:true,
                        slicecount:3
					},
					shuffle: {
                        duration:1500,
                        easing:"easeOutCubic",
                        columncount:5,
                        checked:true,
                        rowcount:5
					},
					threed: {
                        checked:true,
                        bgcolor:"#222222",
                        perspective:win_width,
                        slicecount:5,
                        duration:1500,
                        easing:"easeOutCubic",
                        fallback:"slice",
                        scatter:5,
                        perspectiveorigin:"right"
					},
				 transition: transitionstr	
			});
			//html5zoo-text position
			var fontheight = $('#'+layerid+' .unslidertxtf').height();
			var textheight = parseInt(params.title_size)+10;
			if(params.show_title=='1'){					
					if($('#'+layerid+' .html5zoo-text-bg-1').css('display')=='none'){
						var fv = parseInt($('#'+layerid+' .html5zoo-title-1').css('font-size'));
						var sv = parseInt($('#'+layerid+' .html5zoo-text-1').css('padding-top'));
						fontheight = fv+sv*2;
					}else if(fontheight<textheight){
						fontheight = fontheight+textheight;
					}
			}
			titlebarfunc=function(){
				var cntheight = $('#'+layerid+' .wp-unslider_content').height();
				$('#'+layerid+' .unslidertxtf').css({'top':(cntheight-fontheight)});
			}
			titlebarfunc();
			
			if(params.show_nav=='0'){				
				$('#'+layerid+' .dotsnew-nav').css({'display':'none'});
			}
		});    
	});
	
};
function layer_breadcrumb_ready_func(layerid, showorder){
	if (showorder == '2') {
		var $span_home=$("#"+layerid).find(".breadcrumb_plugin span").eq(0).clone();
		var $span_fuhao=$("#"+layerid).find(".breadcrumb_plugin span").eq(1).clone();
		$("#"+layerid).find(".breadcrumb_plugin span").eq(0).remove();
		$("#"+layerid).find(".breadcrumb_plugin span").eq(0).remove();
		$("#"+layerid).find(".breadcrumb_plugin").append($span_fuhao).append($span_home);
	}
	
	var fuhao1=['>>','※','◇','→','—','∷','⊙','☆','》','～','＞','＆','★','￤','#','≡'];
	var fuhao2=['<<','※','◇','←','—','∷','⊙','☆','《','～','<','＆','★','￤','#','≡'];
	window['ShowOrder'] = function(gzfuhao,plugin_id){
		$span_html=$($("#"+plugin_id).find(".breadcrumb_plugin").html()).clone();
		$("#"+plugin_id).find(".breadcrumb_plugin").html('');
		$.each($span_html,function(i,n){
			$("#"+plugin_id).find(".breadcrumb_plugin").prepend($(n));
		});
		$("#"+plugin_id).find(".breadcrumb_plugin").find("span:odd").html(gzfuhao);
	};
	window['ShowOrder2'] = function(plugin_id){
		if($("#"+plugin_id).find(".breadcrumb_plugin").find('span').last().attr('gzdata')!='gzorder') {
			ShowOrder(fuhao2[$('#'+plugin_id).find(".breadcrumbfuhao").attr("gz")],plugin_id);
		}
	};
	window['ShowOrder1'] = function(plugin_id){
		if($("#"+plugin_id).find(".breadcrumb_plugin").find('span').last().attr('gzdata')=='gzorder') {
			ShowOrder(fuhao1[$('#'+plugin_id).find(".breadcrumbfuhao").attr("gz")],plugin_id);
		}
	};
	//隐藏当前页
	var ShowCpage =  $("#"+layerid).find('.wp-breadcrumb_content').attr('ShowCpage');
	if (ShowCpage == 0) {
		var pos = (showorder == 2)?'first':'last';
		$("#"+layerid).find('.breadcrumbtext:not(.home):'+pos).hide();
		$("#"+layerid).find('.breadcrumbfuhao:'+pos).hide();
	}
};
function layer_new_navigation_hs6_func(params){
	var layer_id = params.layer_id;
	window[layer_id+'_getSubMenuHoverCss'] = function(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		
		var navStyle = wp_get_navstyle(layer_id, 'datastys_');
		if(navStyle.length > 0)
		{
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		
		var navStyle = wp_get_navstyle(layer_id, 'datasty_');
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);
			
			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}

		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	};
	
	$('#'+layer_id).layer_ready(function(){
		setTimeout(function(){
			wp_nav_addMoreButton(layer_id);
		},0);
		var fatherid = $.getElementFatherid($('#' + layer_id)) || '';
		if(fatherid=='site_footer' || fatherid=='canvas') fatherid='';
		var $father = fatherid.length ? $('#' + fatherid) : $([]), father_zidx = $father.css('zIndex');
		$('#nav_'+layer_id).find('li').hover(function(){
			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				if($(this).hasClass('wp_subtop')) $(this).parent().css('z-index',resizehandle+1);

				var canvas_zindex = $('#canvas').css('z-index');
				var $toolbar = $(".propblk[super='"+layer_id+"']");
				if($toolbar.length > 0)  $toolbar.css('z-index',canvas_zindex - 1);
			}
			var smcenter=$("#"+layer_id).find('.nav1').attr('smcenter');
			if ($(this).hasClass('wp_subtop')) {
				if (smcenter == 1) {
					var w = $(this).outerWidth();
					var cw = $(this).children('ul').outerWidth();
					var cl = parseInt((cw - w)/2);
				} else {
					var cl = 0;
				}
			}
			$(this).children('ul').css('left','-'+cl+'px').show();
			if ($father.length) $father.css('z-index', '9999');
			var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
			if(type==2){
				var self = $(this);
				var pos = 0 ;
				var loops = 0;
				$('#nav_'+layer_id).find('li').each(function(){
					if(loops == 1) return true;
					if(self.html() == $(this).html()){
						loops = 1;
						return true;
					}else{
						pos = pos + $(this).outerWidth();
					}	
					 
				})
				 
				$("#"+layer_id).find('.ddli').hide();
				var this_width = $('#nav_'+layer_id).outerWidth();
				var thisul_left = $('#nav_'+layer_id).css("padding-left");
				thisul_left = parseInt(thisul_left);
				$(this).children('.ddli').outerWidth(this_width).css("margin-left","-"+(thisul_left+pos+5)+"px");
				$(this).children('.ddli').eq(0).slideDown();
			}
		},function(){
			$(this).children('ul').hide();
			if ($father.length) $father.css('z-index', father_zidx);
			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				var isHover = true;
				$('#nav_'+layer_id).find('ul').each(function(){
					if($(this).css('display') != 'none') {isHover = false;return false;}
				});
				if(isHover)
				{
					if(!($.browser.msie && $.browser.version < 9)) $(this).parent().css('z-index',resizehandle-1);
					var $toolbar = $(".propblk[super='"+layer_id+"']");
					if($toolbar.length > 0)  $toolbar.css('z-index','999');
				}
			}
			var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
			if(type==2){
				$("#"+layer_id).find('.ddli').slideUp();
			}
		});


		//子菜单位置设置
		$(".menu_"+params.menustyle+" #nav_"+layer_id).find('li').mouseenter(function(){
			var firstLi = $(this);
			var firestLiouterWidth = firstLi.outerWidth();
			var tmp_max_width = 0;
			firstLi.children('ul').children('li').each(function(){
				if($(this).outerWidth() < firestLiouterWidth)
					$(this).width(firestLiouterWidth - parseInt($(this).css('padding-left')) - parseInt($(this).css('padding-right')));
				else if($(this).outerWidth() > tmp_max_width) tmp_max_width = $(this).outerWidth();
			});
				
			if(tmp_max_width > 0) firstLi.children('ul').children('li').each(function(){
				$(this).width(tmp_max_width - parseInt($(this).css('padding-left')) - parseInt($(this).css('padding-right')));
			});
				
			if(firstLi.parent('ul').attr('id') != 'nav_'+layer_id)
				firstLi.children('ul').css('margin-left',firstLi.outerWidth());
			tmp_max_width = 0;
		});
		
		//第三级即下级菜单随高度增加位置动态修改
		$(".menu_"+params.menustyle+" #nav_"+layer_id+" ul li").hover(function(){
			if($(this).children('ul').length > 0)
			{
				var marginTop = parseInt($(this).children('ul').css('margin-top'));
				if($(this).children('ul').offset().top > $(this).offset().top ||$(this).offset().top-50>$(this).children('ul').offset().top)
					$(this).children('ul').css('margin-top',marginTop - ($(this).children('ul').offset().top - $(this).offset().top) + 'px');
			}
		});

		$('.menu_'+params.menustyle+' #nav_'+layer_id).find('li').hover(function(){
			var direction=$("#"+layer_id).find('.nav1').attr('direction');
			var height = parseInt($(this).outerHeight());
			if($(this).parent().hasClass('navigation'))
			{
				$('#nav_'+layer_id+' .wp_subtop').removeClass("lihover").children('a').removeClass("ahover");
				if(direction==1){				
					$(this).children('ul').css('top','auto').css('bottom',height + 'px');
				}else{				
					$(this).children('ul').css('top',height+'px').css('bottom','auto');	
				}
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",0),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",0),'color':window[layer_id+'_getSubMenuHoverCss']("color",0),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",0),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",0)});
			}else{
				if(direction==1){
					$(this).children('ul').css('top','auto').css('bottom', '-0px');
				}else{
					$(this).children('ul').css('top',height+'px').css('bottom','auto');					
				}
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",1),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",1),'color':window[layer_id+'_getSubMenuHoverCss']("color",1),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",1),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",1)});
			}
		},function(){
			if($(this).parent().hasClass('navigation'))
			{
				wp_showdefaultHoverCss(layer_id);
			}
			 $(this).children('a').attr("style",'');
				
		});
		wp_showdefaultHoverCss(layer_id);
		wp_removeLoading(layer_id);
	});
}