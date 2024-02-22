"use client";
import { useEffect, useRef, useState } from "react";
import JazziconAvatar from "./JazziconAvatar";

const DEFAULT_URL = "https://effigy.im/a";

export interface AvatarProp {
  url?: string;
  size?: number;
  address?: string;
  cid?: string; // cos file id fow now
}

export default function Avatar({ url, size, address, cid }: AvatarProp) {
  const imgRef = useRef(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJazzAvatar, setIsJazzAvatar] = useState(false);

  if (size == null) size = 3;

  useEffect(() => {
    if (!url && address) {
      setIsJazzAvatar(true);
      setIsLoading(false);
    } else {
      setIsJazzAvatar(false);
    }
  }, [cid, address, url]);

  const handleError = (_e: any) => {
    // @todo
    setIsError(true);
  };

  const handleLoad = (_e: any) => {
    // @todo
    setIsError(false);
    setIsLoading(false);
  };

  return (
    <div className="avatar">
      <div
        className="rounded-full"
        style={{
          width: size * 16,
          height: size * 16,
        }}
      >
        {url ? (
          // eslint-disable-next-line
          <img
            className={`${isError ? "hidden" : ""}`}
            ref={imgRef}
            src={url!}
            onError={handleError}
            onLoad={handleLoad}
            alt={`${url || address}`}
          />
        ) : isJazzAvatar && address ? (
          <JazziconAvatar address={address} diameter={size * 16} />
        ) : null}
        <div
          className={`skeleton w-full h-full rounded-full ${
            isLoading ? "" : "hidden"
          }`}
        ></div>
        <div
          className={`w-full h-full rounded-full bg-slate-200 ${
            isError ? "" : "hidden"
          }`}
        ></div>
      </div>
    </div>
  );
}
