import { motion } from "motion/react";
import useMotionPreference from "@hooks/useMotionPreference";
import AvatarMark from "./AvatarMark";
import {
   AVATAR_SIZE,
   CARD_FILL,
   GLYPH_SIZE,
   HAIRLINE,
   ORBIT_PERIOD,
   ORBIT_RADIUS,
   TILE_RADIUS,
   TILE_SIZE,
   orbitItems,
   orbitPosition,
} from "./devAvatarData";

const SPIN = {
   duration: ORBIT_PERIOD,
   repeat: Infinity,
   ease: "linear" as const,
};

const TURN = { transform: ["rotate(0deg)", "rotate(360deg)"] };
const COUNTER_TURN = { transform: ["rotate(0deg)", "rotate(-360deg)"] };

const DevAvatar = () => {
   const { preference, reducedMotion } = useMotionPreference();
   const centre = AVATAR_SIZE / 2;

   return (
      <div
         key={preference}
         aria-hidden="true"
         className="about-orbit"
         style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            position: "relative",
            margin: "0 auto",
         }}
      >
         <AvatarMark />

         <svg
            style={{ position: "absolute", inset: 0 }}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            viewBox={`0 0 ${AVATAR_SIZE} ${AVATAR_SIZE}`}
         >
            <circle
               cx={centre}
               cy={centre}
               r={ORBIT_RADIUS}
               fill="none"
               stroke={HAIRLINE}
               strokeWidth="1"
               strokeDasharray="4 6"
            />
         </svg>

         <motion.div
            style={{ position: "absolute", inset: 0 }}
            animate={reducedMotion ? undefined : TURN}
            transition={SPIN}
         >
            {orbitItems.map(({ name, Icon, color, angle }) => {
               const { x, y } = orbitPosition(angle);
               return (
                  <motion.div
                     key={name}
                     style={{
                        position: "absolute",
                        left: x - TILE_SIZE / 2,
                        top: y - TILE_SIZE / 2,
                        width: TILE_SIZE,
                        height: TILE_SIZE,
                        borderRadius: TILE_RADIUS,
                        background: CARD_FILL,
                        border: `1px solid ${HAIRLINE}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                     }}
                     animate={reducedMotion ? undefined : COUNTER_TURN}
                     transition={SPIN}
                  >
                     <Icon size={GLYPH_SIZE} color={color} />
                  </motion.div>
               );
            })}
         </motion.div>
      </div>
   );
};

export default DevAvatar;
