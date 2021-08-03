import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export async function cmd(command: string) {
  const cwd = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath;

  const env = process.env;
  const envPath = env.Path || env.path || '';

  const vscodeCwd = process.env.VSCODE_CWD || '';
  const lstudioPath = path.join(vscodeCwd, 'resources', 'app');
  const builtInNodePath = path.join(lstudioPath, 'CastorTool', 'node');
  if (fs.existsSync(builtInNodePath)) {
    const envPathLen = envPath && envPath.length || 0;
    const builtInGitPath = path.join(lstudioPath, 'CastorTool', 'git', 'cmd');
    const pathArray = [];
    let hasQuate = false;
    let latestSemicolon = -1;
    for (let i = 0; i < envPathLen; i++) {
      const char = envPath.substring(i, i + 1);
      if (char === '"' && !hasQuate) {
        hasQuate = true;
      } else if (char === '"' && hasQuate) {
        hasQuate = false;
      }
      if (!hasQuate && char === ';') {
        const pathItem = envPath.substring(latestSemicolon + 1, i);
        latestSemicolon = i;
        if (pathItem.startsWith('"') && pathItem.endsWith('"')) {
          pathArray.push(pathItem.substring(1, pathItem.length - 1));
        } else {
          pathArray.push(pathItem);
        }

      }
    }
    const needGit = pathArray.filter(pathItem => {
      return pathItem.includes('git/cmd');
    }).length === 0;
    const targetArray = pathArray.filter((pathItem) => {
      return !(pathItem.includes('node') || pathItem.includes('npm'));
    });
    targetArray.push(builtInNodePath);
    if (needGit) {
      targetArray.push(builtInGitPath);
    }
    env.Path = targetArray.map(pathItem => {
      if (pathItem.includes(';')) {
        return `"${pathItem}"`;
      }
      return pathItem;
    }).join(';');
  }

  const res = await exec(command, {
    shell: process.platform === 'darwin' ? undefined : 'powershell',
    cwd,
    env,
    encoding: 'utf8',
  });
  console.log(res);
  const { stdout, stderr } = res;
  return {
    success: !stderr,
    stdout: stdout
  };
}