import { FaGithub, FaXTwitter, FaInstagram } from "react-icons/fa6";
import type { IconMap } from "@/types";

/* Social glyphs for the hero and the footer, keyed by the `icon` name in
   data/personal.json social_profiles. */
const ICON_MAP: IconMap = {
   FaGithub: FaGithub,
   FaXTwitter: FaXTwitter,
   FiInstagram: FaInstagram,
};

export default ICON_MAP;
