import Navigo from "navigo";
import jQuery from "jquery";
const router = new Navigo("/");
import Homes from "./js/home";
import Shops from "./js/shops";
import Carts from "./js/cart";
import Chackouts from "./js/chackout";
import Contacts from "./js/contact";
import ShopDetails from "./js/shopdetail";
import Notfound from "./js/notfound";
import ManageCateAd from "./js/admin/manageCate";
import AdminDasboard from "./js/admin/adminDasboard";

router
  .on("/", function () {
    Homes.homePages();
  })
  .on("/cart", function () {
    Carts.CartPages();
  })
  .on("/shop", function () {
    Shops.shopPages();
    Shops.getApi();
    Shops.getApiCate();
    Shops.showProducts();
    Shops.showProductsByCategory();
    Shops.handleIdSearch();
    Shops.handleGetValuePrice();
    Shops.handleCheckout();
  })
  .on("/chackout", function () {
    Chackouts.chackoutPages();
  })
  .on("/contact", function () {
    Contacts.contactPages();
  })
  .on("/shop_detail", function () {
    ShopDetails.shopDetailPages();
  })
  .on("/404", function () {
    Notfound.notFoundPages();
  })
  .on("/admin", function () {
    AdminDasboard.adminPages();
  })
  .on("/admin/managecategories", function () {
    ManageCateAd.manageCatePage();
    ManageCateAd.handleGetDataCate();
  });

router.resolve();
(function ($) {
  "use strict";

  $(document).ready(function () {
    $("#myModal").on("hidden.bs.modal", function () {
      // Code xử lý sau khi modal đã đóng
    });
  });
  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(window).width() < 992) {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow");
      } else {
        $(".fixed-top").removeClass("shadow");
      }
    } else {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow").css("top", -55);
      } else {
        $(".fixed-top").removeClass("shadow").css("top", 0);
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonial carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 2000,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 2,
      },
      1200: {
        items: 2,
      },
    },
  });

  // vegetable carousel
  $(".vegetable-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    //   console.log($videoSrc);

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      );
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Product Quantity
  $(".quantity button").on("click", function () {
    let button = $(this);
    let oldValue = button.parent().find("input").val();
    let newVal;

    if (button.text() == "+") {
      newVal = parseFloat(oldValue) + 1;
    } else {
      // Don't allow decrementing below zero
      if (oldValue > 0) {
        newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 0;
      }
    }
    button.parent().find("input").val(newVal);
  });
})(jQuery);
