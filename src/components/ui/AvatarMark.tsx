import {
   AVATAR_SIZE,
   CARD_FILL,
   DISC_DIAMETER,
   HAIRLINE,
} from "./devAvatarData";

/**
 * The disc at the centre of the orbit.
 *
 * Deliberately blank: no portrait, no placeholder picture. The dashed ring and
 * the rotating stack tiles around it are the artwork. To put something in the
 * middle later, render it here at `DISC_DIAMETER - 2` px.
 */
const AvatarMark = () => (
   <div
      style={{
         position: "absolute",
         inset: (AVATAR_SIZE - DISC_DIAMETER) / 2,
         borderRadius: "50%",
         background: CARD_FILL,
         border: `1px solid ${HAIRLINE}`,
         overflow: "hidden",
      }}
   />
);

export default AvatarMark;
