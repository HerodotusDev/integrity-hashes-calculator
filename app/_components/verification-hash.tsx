"use client";

import { useMemo } from "react";
import Arrow from "./arrow";
import Box from "./box";
import hash, { stringToHex } from "./hash";

interface Props {
    factHash: string;
    securityBits: string;
    layout: string;
    hasher: string;
    stoneVersion: string;
    memoryVerification: string;
    updateLayout?: (s: string) => void;
    updateHasher?: (s: string) => void;
    updateStoneVersion?: (s: string) => void;
    updateMemoryVerification?: (s: string) => void;
    updateFactHash?: (s: string) => void;
    updateSecurityBits?: (s: string) => void;
}

export default function VerificationHash({
    factHash,
    securityBits,
    layout,
    hasher,
    stoneVersion,
    memoryVerification,
    updateLayout,
    updateHasher,
    updateStoneVersion,
    updateMemoryVerification,
    updateFactHash,
    updateSecurityBits,
}: Props) {
    const verifierConfigurationHash = useMemo(
        () =>
            hash(
                [layout, hasher, stoneVersion, memoryVerification].map(
                    stringToHex,
                ),
            ),
        [layout, hasher, stoneVersion, memoryVerification],
    );
    const verificationHash = useMemo(
        () => hash([factHash, verifierConfigurationHash, securityBits]),
        [factHash, verifierConfigurationHash, securityBits],
    );

    return (
        <div className="flex min-w-min items-center justify-center px-4 pt-8">
            <Box
                root={4}
                values={[]}
                above={[
                    <Box
                        values={[layout]}
                        onUpdate={
                            updateLayout ? (_, s) => updateLayout(s) : undefined
                        }
                        topText="layout"
                        colStart={1}
                        className="mx-1"
                        key="1"
                    />,
                    <Box
                        values={[hasher]}
                        onUpdate={
                            updateHasher ? (_, s) => updateHasher(s) : undefined
                        }
                        topText="hasher"
                        colStart={2}
                        className="mx-1"
                        key="2"
                    />,
                    <Box
                        values={[stoneVersion]}
                        onUpdate={
                            updateStoneVersion
                                ? (_, s) => updateStoneVersion(s)
                                : undefined
                        }
                        topText="stone version"
                        colStart={3}
                        className="mx-1"
                        key="3"
                    />,
                    <Box
                        values={[memoryVerification]}
                        onUpdate={
                            updateMemoryVerification
                                ? (_, s) => updateMemoryVerification(s)
                                : undefined
                        }
                        topText="memory verification"
                        colStart={4}
                        className="mx-1"
                        key="4"
                    />,
                    <Arrow
                        cols={[true, true, true, true]}
                        bottom={2}
                        key="5"
                    />,
                ]}
                below={[
                    <Box
                        values={[factHash]}
                        onUpdate={
                            updateFactHash
                                ? (_, s) => updateFactHash(s)
                                : undefined
                        }
                        topText="fact hash"
                        colStart={1}
                        className="mx-1"
                        key="2"
                    />,
                    <Box
                        values={[verifierConfigurationHash]}
                        topText="configuration hash"
                        colStart={2}
                        className="mx-1"
                        key="3"
                    />,
                    <Box
                        values={[securityBits]}
                        onUpdate={
                            updateSecurityBits
                                ? (_, s) => updateSecurityBits(s)
                                : undefined
                        }
                        topText="security bits"
                        colStart={3}
                        className="mx-1"
                        key="4"
                    />,
                    <Arrow cols={[true, true, true]} bottom={2} key="1" />,
                    <Box
                        values={[verificationHash]}
                        topText="verification hash"
                        colStart={2}
                        className="mx-1"
                        key="5"
                    />,
                ]}
            />
        </div>
    );
}
