#!/usr/bin/env python3
"""从固定HiveOS提交整理公开介绍；不复制规范、环境配置或运行记录。"""
import argparse
import datetime
import hashlib
import json
import posixpath
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    parser.add_argument('--commit', required=True)
    args = parser.parse_args()
    def git(*parts):
        return subprocess.check_output(['git', '-C', str(args.source), *parts])
    origin = git('remote', 'get-url', 'origin').decode().strip()
    if origin not in ('https://github.com/xiiiblue/hive-os.git', 'https://github.com/xiiiblue/hive-os', 'git@github.com:xiiiblue/hive-os.git'):
        raise ValueError('来源仓库不符')
    if not re.fullmatch('[0-9a-f]{40}', args.commit) or git('rev-parse', args.commit+'^{commit}').decode().strip() != args.commit:
        raise ValueError('需要完整提交')
    manifest_path = ROOT/'src/data/source.json'
    source = json.loads(manifest_path.read_text())
    mapping = {p['source']: p['slug'] for p in source['pages'] if p['kind'] != 'topic'}
    flow = {
        'adapters': [('QueenBee与Hermes', '调查、登记与采纳沟通'), ('远程开发机Codex', 'Hermes只协调该机获准任务'), ('MacMini Codex', 'Director直接协同，不受Hermes指导'), ('GitHub与Webhook', '共享事实，按准确受众回执')],
        'workflow': [('反馈与调查', '咨询直接答复，符合条件才登记'), ('明确授权', 'Issue是交接点，采纳不等于开工'), ('两处Codex', '先核对占用，手动或有效定时配置启动'), ('两个终点', 'PR待审或完整交付，通知结果另记')],
        'receipts': [('核验阶段事实', '核对原来源、用途和获准Webhook'), ('读取原通知账', '沿用稳定编号，确认没有未知尝试'), ('提交一次', '先持久记录，再发送已审阅摘要'), ('按结果继续', '平台已接受则复用，未知或缺账停止')],
    }
    def public(text):
        return re.sub(r'(?<!\d)203(?!\d)', '远程开发机', text).replace('51.8开发环境', '示例开发环境').replace('51.8', '示例开发环境')
    def render(raw, name, slug):
        text = public(raw.decode())
        text = re.sub(r'\A(# [^\n]+\n)\n(?:>[^\n]*\n)+\n', r'\1\n', text, count=1)
        def link(m):
            label, target = m.groups()
            if re.match(r'https?://', target):
                if 'github.com/xiiiblue/hive-os/' in target: return label
                return m.group(0)
            if target.startswith('#'): return m.group(0)
            path, sep, anchor = target.partition('#')
            resolved = posixpath.normpath(posixpath.join(posixpath.dirname(name), path))
            if resolved in mapping:
                return '['+label+'](/flow/read/'+mapping[resolved]+'/'+(sep+anchor if sep else '')+')'
            return label
        text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', link, text)
        if '```mermaid' in text:
            if slug not in flow: raise ValueError('新增图示需要人工整理：'+slug)
            diagram = '<div class="article-flow" aria-label="协作流程说明">'+''.join('<div><strong>'+title+'</strong><p>'+desc+'</p></div>' for title, desc in flow[slug])+'</div>'
            text = re.sub(r'```mermaid\n.*?```', lambda m: diagram, text, flags=re.S)
        return re.sub(r'\n{3,}', '\n\n', text).strip()+'\n'
    files = {}
    for name, slug in mapping.items():
        if not name.startswith(source['handbookRoot']+'/'): raise ValueError('超出介绍目录')
        raw = git('show', args.commit+':'+name)
        files[name] = hashlib.sha256(raw).hexdigest()
        page = next(p for p in source['pages'] if p['slug'] == slug)
        content = render(raw, name, slug)
        front = '---\nlayout: ../../layouts/Reader.astro\ntitle: '+json.dumps(page['title'],ensure_ascii=False)+'\nsource: '+json.dumps(name,ensure_ascii=False)+'\n---\n\n'
        (ROOT/'src/pages/read'/f'{slug}.md').write_text(front+content)
        if name == source['snapshotSource']:
            snapshot = content.encode()
            (ROOT/source['snapshot']).write_bytes(snapshot)
            source['snapshotSHA256'] = hashlib.sha256(snapshot).hexdigest()
    source.update(commit=args.commit, reviewedOn=datetime.date.today().isoformat(), files=files,
                  edition='2.0', dependencyOrder=['HiveFlow规范','HiveFlow介绍','HiveFlow网站','独立hive-flow仓库'],
                  normativeChecks=['HFL-003','HFL-006','HFL-007','HFL-009','HFL-016','HFL-017','HFL-019','HFL-020','HFL-021','HFL-022'],
                  editorialPolicy='从固定提交整理公开介绍；规范仅本地核对。环境简称通用化、私有链接改说明、图示转静态流程；snapshotSHA256记录公开目录整理稿，files保存源文件原始摘要。')
    manifest_path.write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
    print('已整理16份介绍，同源提交：'+args.commit)

if __name__ == '__main__': main()
