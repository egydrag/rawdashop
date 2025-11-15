"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "@sweetalert2/theme-dark/dark.css";

export default function WelcomePopup() {
  useEffect(() => {
    if (sessionStorage.getItem("welcomeShown") !== "true") {
      Swal.fire({
        title: "مرحباً بكم في متجر روضة للإكسسوارات 💕",
        text: "سعداء جداً بزيارتكم! 😍 استمتعوا بأجمل الإكسسوارات",
        icon: "success",
        confirmButtonText: "هيا نبدأ ❤️",
        confirmButtonColor: "#ec4899",

        background: "rgba(255, 255, 255, 0.4)",
        backdrop: `
        rgba(0,0,0,0.4)
        url("https://i.gifer.com/7efs.gif")
        center
        no-repeat
      `,

        // ✨✨ الأنميشن ✨✨
        showClass: {
          popup: `
          animate__animated
          animate__fadeInDown
          animate__faster
        `,
        },
        hideClass: {
          popup: `
          animate__animated
          animate__fadeOutUp
          animate__faster
        `,
        },
      });

      sessionStorage.setItem("welcomeShown", "true");
    }
  }, []);

  return null;
}
