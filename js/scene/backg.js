mui.init({
	pullRefresh: {
		container: "#info",
		up: {
			height: 50,
			auto: true,
			contentrefresh: "正在加载...",
			contentnomore: "没有更多数据了",
			callback: moreInfo
		}
	}
});

var swiper = new Swiper(".swiper-container", {
	slidesPerView: 3.8,
	spaceBetween: 10,
	resistanceRatio: 0,
	watchOverflow: true,
	observer: true,
	observeParents: true
});

var bg = angular.module("bg", []);
bg.controller("bgCon", function($scope) {
	$scope.originColor = new Array("#FFFFFF", "#9fb2c0", "#d3c3c4", "#a09aa6", "#8CC7B5", "#D1BA74", "#ECAD9E", "#F4606C", "#716f7d", "#314d58", "#000000");

});

/*本地在线切换*/
var menu = document.getElementById("menu")
menu.addEventListener("tap", function() {
	var online = document.getElementById("online-text");
	var location = document.getElementById("location-text");
	var content = menu.innerHTML;
	if(content == "使用过") {
		online.style.display = "none";
		location.style.display = "block";
		menu.innerHTML = "在线";
	} else {
		online.style.display = "block";
		location.style.display = "none";
		menu.innerHTML = "使用过";
	}
});

//选择背景图
mui(".info").on("tap", ".cover", function() {
	var img = this.childNodes[1].src;
	var view = plus.webview.getWebviewById("issue");
	mui.fire(view, "getBackg", {
		img: img
	});
	mui.back();
});
//选择纯色
mui(".swiper-wrapper").on("tap", ".pure", function() {
	var bgColor = this.childNodes[1].style.backgroundColor;
	var view = plus.webview.getWebviewById("issue");
	mui.fire(view, "getBackgC", {
		bgColor: bgColor
	});
	mui.back();
});

mui("body").on("tap", "#issue", function(e) {
	galleryImg();
});

var count = 0;

function moreInfo() {
	setTimeout(function() {
		mui("#info").pullRefresh().endPullup((++count > 2));
		var info = document.body.querySelector(".recommend");
		var list = document.body.querySelectorAll(".recommend .cover");
		for(var i = 0; i < list.length; i++) {
			var div = document.createElement("div");
			switch(i % 3) {
				case 0:
					div.className = "cover";
					break;
				case 1:
					div.className = "cover add";
					break;
				default:
					div.className = "cover right";
					break;
			}
			div.innerHTML = "<img src='../img/cover.jpg' />";
			info.appendChild(div);
		}
	}, 2000);
}

//本地相册选择
function galleryImg() {
	plus.gallery.pick(function(a) {
		plus.io.resolveLocalFileSystemURL(a, function(entry) {
			plus.io.resolveLocalFileSystemURL("_doc/", function(root) {
				root.getFile("background.png", {}, function(file) {
					file.remove(function() {
						entry.copyTo(root, "background.png", function(e) {
							var img = e.fullPath + "?version=" + new Date().getTime();
							cropeImg(img);
						});
					});
				}, function() {
					entry.copyTo(root, "background.png", function(e) {
						img = e.fullPath + "?version=" + new Date().getTime();
						cropeImg(img);
					});
				});
			})
		});
	})
};

var cropeImg = function(url) {
	mui.openWindow({
		id: "crop",
		url: "./cropper.html",
		extras: {
			img: url
		},
		show: {
			aniShow: "slide-in-bottom"
		}
	});
}