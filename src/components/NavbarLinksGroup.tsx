import { useState } from 'react';
import { IconCalendarStats, IconChevronRight } from '@tabler/icons-react';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from './NavbarLinksGroup.module.css';
import * as React from "react";
import {Link, useMatchRoute} from "@tanstack/react-router";

interface LinksGroupProps {
    icon: React.FC<any>;
    label: string;
    initiallyOpened?: boolean;
    link?: string
    links?: { label: string; link: string; params?: any }[];
    params?: any
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links, link, params }: LinksGroupProps) {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    const matchRoute = useMatchRoute();

    const items = (hasLinks ? links : []).map((link) => (
        <Link activeProps={{className: classes.active}} to={link.link} params={link.params} key={link.label} className={classes.link}>{link.label}</Link>
    ));

    if (hasLinks) return (
        <>
            <UnstyledButton onClick={() => setOpened((o) => !o)}
                            className={classes.control + (matchRoute({to: link, params: params, fuzzy: true}) ? (" " + classes.active) : "")}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon size={18} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={1.5}
                            size={16}
                            style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse expanded={opened}>{items}</Collapse> : null}
        </>
    )
    else return (
        <Link activeOptions={{exact: true}} activeProps={{className: classes.active}} to={link} params={params} className={classes.control}>
            <Group justify="space-between" gap={0}>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                    <ThemeIcon variant="light" size={30}>
                        <Icon size={18} />
                    </ThemeIcon>
                    <Box ml="md">{label}</Box>
                </Box>
                {hasLinks && (
                    <IconChevronRight
                        className={classes.chevron}
                        stroke={1.5}
                        size={16}
                        style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
                    />
                )}
            </Group>
        </Link>
    )
}

const mockdata = {
    label: 'Releases',
    icon: IconCalendarStats,
    links: [
        { label: 'Upcoming releases', link: '/' },
        { label: 'Previous releases', link: '/' },
        { label: 'Releases schedule', link: '/' },
    ],
};

export function NavbarLinksGroup() {
    return (
        <Box mih={220} p="md">
            <LinksGroup {...mockdata} />
        </Box>
    );
}