import { app, webContents } from '@electron/remote';
import { ProcessMetric, WebContents } from 'electron';
import filesize from 'filesize';
import format from 'format-number';
import React, { ReactNode, useEffect, useState } from 'react';
import { APPLICATION_NAME } from '../../../../../../constants';
import {
    StyledTable,
    StyledTableBody,
    StyledTableHead,
    StyledTableRow,
    StyledTableRowData,
    StyledTableRowHead,
    StyledTableSectionRow,
    StyledTableSectionRowData,
    StyledTableSectionRowHead
} from './styles';


const formatPercentage = format({
    round: 1,
    padRight: 1
});

interface TableSectionTitleProps {
    title: ReactNode;
}

const TableSectionTitle = ({ title }: TableSectionTitleProps) => (
    <StyledTableSectionRow>
        <StyledTableSectionRowHead colSpan={2}><h3>{title}</h3></StyledTableSectionRowHead>
        <StyledTableSectionRowData />
        <StyledTableSectionRowData />
        <StyledTableSectionRowData />
    </StyledTableSectionRow>
);

interface TableItemProps {
    metric: ProcessMetric;
}

const TableItem = ({ metric }: TableItemProps) => {
    const getMetricName = () => {
        switch (metric.type) {
            case 'Browser':
                return APPLICATION_NAME;
            case 'Tab':
                const contents = webContents.getAllWebContents().find((contents) => contents.getOSProcessId() === metric.pid);
                if (!contents) return metric.name;

                switch (contents.getType()) {
                    case 'backgroundPage':
                        const extension = contents.session.getAllExtensions().find((extension) => contents.getURL().includes(extension.id));
                        if (!extension) return contents.getTitle();

                        return extension.name;
                    default:
                        return contents.getTitle();
                }
            case 'GPU':
                return 'GPU プロセス';
            case 'Pepper Plugin':
            case 'Pepper Plugin Broker':
            case 'Sandbox helper':
            case 'Zygote':
            case 'Utility':
                return metric.name;
        }
    };

    return (
        <StyledTableRow key={metric.pid}>
            <StyledTableRowHead colSpan={2} title={getMetricName()}>{getMetricName()}</StyledTableRowHead>
            <StyledTableRowData>{formatPercentage(metric.cpu.percentCPUUsage)} %</StyledTableRowData>
            <StyledTableRowData>{filesize(metric.memory.workingSetSize * 1024)}</StyledTableRowData>
            <StyledTableRowData>{metric.pid}</StyledTableRowData>
        </StyledTableRow>
    );
};

export const Table = () => {
    const [metrics, setMetrics] = useState<ProcessMetric[]>(app.getAppMetrics());

    useEffect(() => {
        const timer = setInterval(() => {
            setMetrics(app.getAppMetrics);
        }, 1000 * 5);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const getMetricType = (pid: number) => {
        const contents = webContents.getAllWebContents().find((contents: WebContents) => contents.getOSProcessId() == pid);
        if (!contents) return undefined;

        return contents.getType();
    };

    const browserMetrics = metrics.filter((metric) => metric.type === 'Browser');
    const windowMetrics = metrics.filter((metric) => getMetricType(metric.pid) === 'window');
    const viewMetrics = metrics.filter((metric) => getMetricType(metric.pid) === 'browserView' || getMetricType(metric.pid) === 'webview');
    const extensionMetrics = metrics.filter((metric) => getMetricType(metric.pid) === 'backgroundPage');
    const remoteMetrics = metrics.filter((metric) => getMetricType(metric.pid) === 'remote');
    const graphicsMetrics = metrics.filter((metric) => metric.type === 'GPU');
    const utilityMetrics = metrics.filter((metric) => metric.type === 'Utility');

    return (
        <StyledTable>
            <StyledTableHead>
                <StyledTableRow>
                    <StyledTableRowHead colSpan={2}>名前</StyledTableRowHead>
                    <StyledTableRowHead>CPU</StyledTableRowHead>
                    <StyledTableRowHead>メモリ</StyledTableRowHead>
                    <StyledTableRowHead>プロセス ID</StyledTableRowHead>
                </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
                {browserMetrics.map((metric) => (<TableItem key={metric.pid} metric={metric} />))}
                {windowMetrics.length > 0 && <TableSectionTitle title={`ウィンドウ (${windowMetrics.length})`} />}
                {windowMetrics.map((metric) => (<TableItem key={metric.pid} metric={metric} />))}
                {viewMetrics.length > 0 && <TableSectionTitle title={`ビュー (${viewMetrics.length})`} />}
                {viewMetrics.map((metric) => (<TableItem key={metric.pid} metric={metric} />))}
                {extensionMetrics.length > 0 && <TableSectionTitle title={`拡張機能 (${extensionMetrics.length})`} />}
                {extensionMetrics.map((metric) => (<TableItem key={metric.pid} metric={metric} />))}
                {remoteMetrics.length > 0 && <TableSectionTitle title={`バックグラウンド コンテンツ (${remoteMetrics.length})`} />}
                {remoteMetrics.map((metric) => (<TableItem key={metric.pid} metric={metric} />))}
                {graphicsMetrics.length > 0 && <TableSectionTitle title={`グラフィックス (${graphicsMetrics.length})`} />}
                {graphicsMetrics.map((metric) => (<TableItem key={metric.pid} metric={metric} />))}
                {utilityMetrics.length > 0 && <TableSectionTitle title={`ユーティリティ (${utilityMetrics.length})`} />}
                {utilityMetrics.map((metric) => (<TableItem key={metric.pid} metric={metric} />))}
            </StyledTableBody>
        </StyledTable>
    );
};
