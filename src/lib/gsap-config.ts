import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// ── Free Plugins ────────────────────────────────────────────────────────────
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// ── Free Eases ───────────────────────────────────────────────────────────────
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";
import { CustomEase } from "gsap/CustomEase";

// ── Club GSAP Plugins (require a paid GSAP membership) ──────────────────────
// https://gsap.com/pricing/
import { CustomBounce } from "gsap/CustomBounce"; // requires CustomEase
import { CustomWiggle } from "gsap/CustomWiggle"; // requires CustomEase
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { EaselPlugin } from "gsap/EaselPlugin";
import { GSDevTools } from "gsap/GSDevTools";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MotionPathHelper } from "gsap/MotionPathHelper";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother"; // requires ScrollTrigger
import { SplitText } from "gsap/SplitText";

// ── Register All Plugins ─────────────────────────────────────────────────────
gsap.registerPlugin(
  useGSAP,

  // Free
  Draggable,
  Flip,
  MotionPathPlugin,
  Observer,
  ScrollToPlugin,
  ScrollTrigger,
  TextPlugin,

  // Free Eases
  RoughEase,
  ExpoScaleEase,
  SlowMo,
  CustomEase,

  // Club GSAP
  CustomBounce,
  CustomWiggle,
  DrawSVGPlugin,
  EaselPlugin,
  GSDevTools,
  InertiaPlugin,
  MotionPathHelper,
  MorphSVGPlugin,
  Physics2DPlugin,
  PhysicsPropsPlugin,
  PixiPlugin,
  ScrambleTextPlugin,
  ScrollSmoother,
  SplitText,
);

export {
  gsap,
  useGSAP,
  // Free
  Draggable,
  Flip,
  MotionPathPlugin,
  Observer,
  ScrollToPlugin,
  ScrollTrigger,
  TextPlugin,
  // Free Eases
  RoughEase,
  ExpoScaleEase,
  SlowMo,
  CustomEase,
  // Club GSAP
  CustomBounce,
  CustomWiggle,
  DrawSVGPlugin,
  EaselPlugin,
  GSDevTools,
  InertiaPlugin,
  MotionPathHelper,
  MorphSVGPlugin,
  Physics2DPlugin,
  PhysicsPropsPlugin,
  PixiPlugin,
  ScrambleTextPlugin,
  ScrollSmoother,
  SplitText,
};
