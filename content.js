const injectScript = () => {
    // Zapobiegamy wielokrotnemu wstrzyknięciu
    if (document.getElementById('hypesquad-injector')) return;

    const script = document.createElement('script');
    script.id = 'hypesquad-injector';
    script.textContent = `
    (function() {
        'use strict';

        setTimeout(() => {
            if (typeof webpackChunkdiscord_app === 'undefined') return;

            let wreq = webpackChunkdiscord_app.push([[Symbol()], {}, (r) => r]);
            webpackChunkdiscord_app.pop();
            const chunks = Object.entries(wreq.m);
            const findChunkByCode = (...codes) => {
                for (let i = 0; i < chunks.length; i++) {
                    const [id, func] = chunks[i];
                    const chunkCode = func.toString();

                    if (codes.every((code) => chunkCode.includes(code)))
                        return wreq(id);
                }
            };
            let _mods = webpackChunkdiscord_app.push([[Symbol()], {}, (r) => r.c]);
            webpackChunkdiscord_app.pop();

            let findByProps = (...props) =>
                WebpackFind((m) => props.every((x) => x in (m || {})));

            let findByPropsAll = (...props) =>
                WebpackFindAll((m) => props.every((x) => x in (m || {})));

            let WebpackFind = (...filters) => {
                for (let m of Object.values(_mods)) {
                    try {
                        if (!m.exports || m.exports === window) continue;

                        if (filters.every((fn) => fn(m.exports))) {
                            return m.exports;
                        }

                        for (let ex in m.exports) {
                            const target = m.exports[ex];

                            if (
                                target &&
                                filters.every((fn) => fn(target)) &&
                                target[Symbol.toStringTag] !== 'IntlMessagesProxy'
                            ) {
                                return target;
                            }
                        }
                    } catch {}
                }
            };
            let WebpackFindAll = (...filters) => {
                let res = [];
                for (let m of Object.values(_mods)) {
                    try {
                        if (!m.exports || m.exports === window) continue;

                        if (filters.every((fn) => fn(m.exports))) {
                            res.push(m.exports);
                        }

                        for (let ex in m.exports) {
                            const target = m.exports[ex];

                            if (
                                target &&
                                filters.every((fn) => fn(target)) &&
                                target[Symbol.toStringTag] !== 'IntlMessagesProxy'
                            ) {
                                res.push(target);
                            }
                        }
                    } catch {}
                }
                return res;
            };

            let map = (obj, mappings) => {
                const result = {};
                for (let key in obj) {
                    for (let map of Object.entries(mappings)) {
                        if (obj[key]?.toString?.()?.includes?.(map[1]))
                            result[map[0]] = obj[key];
                    }
                }
                return result;
            };

            window.toasts = map(findChunkByCode('.currentToastMap.has('), {
                showToast: '.currentToastMap.has(',
            });

            window.toastMaker = map(findChunkByCode('options:{position:'), {
                createToast: 'options:{position:',
            });

            const showToast = function (text, type) {
                window.toasts.showToast(window.toastMaker.createToast(text, type));
            };

            const Components = {
                ...findByProps('openModal', 'closeModal'),
                ...findByProps('ConfirmModal'),
                ...findByProps('Button', 'Text'),
                ...findByProps('Colors'),
            };

            Components.ExpressiveModal = WebpackFind((e) => {
                if (typeof e !== 'function') return;
                const code = e?.toString?.();
                return (
                    code.match(/gradientColor:[a-z-A-Z0-9$_]+="purple"/) &&
                    code.includes('paddingSize:"lg"')
                );
            });
            Components.Button = WebpackFind((e) => {
                if (typeof e !== 'function') return;
                return e.toString().includes('"data-mana-component":"button"');
            });
            Components.Text = findByPropsAll('render').filter((e) =>
                e.render.toString().includes('tabularNumbers:'),
            )[0].render;
            Components.ButtonVariant = {
                PRIMARY: 'primary',
                SECONDARY: 'secondary',
                DANGER_PRIMARY: 'dangerPrimary',
                DANGER_SECONDARY: 'dangerSecondary',
                CRITICAL_SECONDARY: 'critical-secondary',
                OVERLAY_PRIMARY: 'overlayPrimary',
                POSITIVE: 'positive',
                LINK: 'link',
                NONE: 'none',
            };

            const { jsx } = findByProps('jsx');
            const { useState } = findByProps('useState');

            const api = Object.values(findChunkByCode('HTTPUtils')).find((e) => e?.get);

            const setBadge = (id) => api.post({ url: '/hypesquad/online', body: { house_id: id } });

            const Badges = { Bravery: 1, Brilliance: 2, Balance: 3 };

            const HOUSES = [
                {
                    id: 'Bravery',
                    name: 'Bravery',
                    tagline: 'Bold, daring, and adventurous',
                    color: '#9C84EF',
                    icon: 'https://cdn.discordapp.com/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png',
                },
                {
                    id: 'Balance',
                    name: 'Balance',
                    tagline: 'Kind, easygoing, and always looking for a story',
                    color: '#45DDC0',
                    icon: 'https://cdn.discordapp.com/badge-icons/3aa41de486fa12454c3761e8e223442e.png',
                },
                {
                    id: 'Brilliance',
                    name: 'Brilliance',
                    tagline: 'Confident, dedicated, and a lifelong learner',
                    color: '#F47B67',
                    icon: 'https://cdn.discordapp.com/badge-icons/011940fd013da3f7fb926e4a1cd2e618.png',
                },
            ];

            const ToastType = findByProps('CLIP', 'SUCCESS');

            const HouseCard = ({ house, selected, pending, onSelect }) => {
                const [hover, setHover] = useState(false);

                const borderColor = selected
                    ? house.color
                    : hover
                      ? 'rgba(255,255,255,0.28)'
                      : 'rgba(255,255,255,0.08)';

                return jsx('div', {
                    onClick: pending ? undefined : () => onSelect(house.id),
                    onMouseEnter: () => setHover(true),
                    onMouseLeave: () => setHover(false),
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 8,
                        padding: '16px 12px',
                        borderRadius: 12,
                        border: \`2px solid \${borderColor}\`,
                        background: selected ? \`\${house.color}1a\` : 'rgba(255,255,255,0.03)',
                        cursor: pending ? 'default' : 'pointer',
                        opacity: pending && !selected ? 0.5 : 1,
                    },
                    children: [
                        jsx('img', {
                            src: house.icon,
                            style: {
                                width: 48,
                                height: 48,
                            },
                        }),
                        jsx(Components.Text, {
                            variant: 'text-sm/bold',
                            style: { color: selected ? house.color : undefined },
                            children: house.name,
                        }),
                        jsx(Components.Text, {
                            variant: 'text-xs/normal',
                            color: 'text-muted',
                            children: house.tagline,
                        }),
                    ],
                });
            };

            const HypeSquadModal = (props) => {
                const [selected, setSelected] = useState(null);
                const [pending, setPending] = useState(false);

                const finish = () => {
                    Components.closeModal(modalId);
                    delete window.toasts;
                    delete window.toastMaker;
                };

                const handleSelect = (id) => {
                    setSelected(id);
                    setPending(true);

                    setBadge(Badges[id])
                        .then((x) => {
                            if (x?.ok !== false) {
                                showToast(
                                    \`Successfully set your HypeSquad badge to \${id}\`,
                                    ToastType.SUCCESS,
                                );
                                finish();
                                return;
                            }
                            showToast(
                                \`Failed to set badge to \${id}, check console for API response...\`,
                                ToastType.ERROR,
                            );
                            console.log(x);
                            setPending(false);
                        })
                        .catch((err) => {
                            showToast(
                                'Something went wrong, check console for details...',
                                ToastType.ERROR,
                            );
                            console.error(err);
                            setPending(false);
                        });
                };

                return jsx(Components.ExpressiveModal, {
                    title: 'Choose your HypeSquad',
                    onCancel: () => {
                        Components.closeModal(modalId);
                        delete window.toasts;
                        delete window.toastMaker;
                    },
                    ...props,
                    children: jsx('div', {
                        style: { display: 'flex', gap: 16, flexDirection: 'column' },
                        children: [
                            jsx('div', {
                                style: {
                                    display: 'grid',
                                    gap: 10,
                                    gridTemplateColumns: 'repeat(3, 1fr)',
                                },
                                children: HOUSES.map((house) =>
                                    jsx(HouseCard, {
                                        key: house.id,
                                        house,
                                        selected: selected === house.id,
                                        pending,
                                        onSelect: handleSelect,
                                    }),
                                ),
                            }),
                            jsx('div', {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    borderTop: '1px solid rgba(255,255,255,0.08)',
                                    paddingTop: 12,
                                },
                                children: jsx(Components.Text, {
                                    variant: 'text-xs/normal',
                                    color: 'text-muted',
                                    children: 'created by woooosp & zuzakicia',
                                }),
                            }),
                        ],
                    }),
                });
            };

            let modalId = Components.openModal((props) => jsx(HypeSquadModal, props));
        }, 3000);
    })();
    `;
    (document.head || document.documentElement).appendChild(script);
};

injectScript();