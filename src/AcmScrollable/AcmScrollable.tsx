/* Copyright Contributors to the Open Cluster Management project */

import React, { ReactNode, useRef, useState, useCallback, useEffect } from 'react'

/** Scollable container that adds a top shadow on scroll */
export function AcmScrollable(props: { children?: ReactNode }) {
    const divEl = useRef<HTMLDivElement>(null)
    const [topShadow, setTopShadow] = useState(false)
    const update = useCallback(() => {
        /* istanbul ignore else */
        if (divEl.current) {
            setTopShadow(divEl.current.scrollTop > 0)
        }
    }, [])
    useEffect(update, [update])
    return (
        <div
            style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'hidden', position: 'relative' }}
        >
            <div
                ref={divEl}
                style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto' }}
                onScroll={update}
            >
                {props.children}
            </div>
            {
                /* istanbul ignore next */ topShadow && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            height: '6px',
                            width: '100%',
                            background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0))',
                        }}
                    />
                )
            }
        </div>
    )
}
