import React, { useRef, useCallback } from "react";
import { usePopover, InfoPopover } from "components/Popover";

export default function RoleMarkerToggle({
  playerId,
  setup,
  toggleRolePrediction,
}) {
  const roleMarkerRef = useRef();

  const makeRolePrediction = useCallback(
    (prediction) => {
      toggleRolePrediction(playerId, prediction);
      closePopover();
    },
    [playerId, toggleRolePrediction]
  );

  const popoverProps = usePopover({
    path: `/api/setup/${setup.id}`,
    type: "rolePrediction",
    boundingEl: roleMarkerRef.current,
    postprocessData: (data) => {
      let roles = {};
      for (let r of JSON.parse(data.roles)) {
        Object.assign(roles, r);
      }

      data.roles = roles;
      data.makeRolePrediction = makeRolePrediction;
    },
  });
  const { handleClick, closePopover } = popoverProps;

  return (
    <>
      <InfoPopover {...popoverProps} title={"Mark Role as"} />
      <div
        className="role-marker"
        onClick={handleClick}
        ref={roleMarkerRef}
        style={{
          cursor: "pointer",
        }}
      >
        <i className="fas fa-user-edit"></i>
      </div>
    </>
  );
}
