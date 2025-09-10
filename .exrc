set relativenumber

let g:astro_typescript = 'enable'

let g:ale_linters_explicit = 1
let g:ale_linters = {
\ 'astro': ['eslint', 'stylelint'],
\ 'typescript': ['eslint', 'tsserver'],
\ 'javascript': ['eslint', 'tsserver'],
\ 'typescriptreact': ['eslint', 'tsserver'],
\ 'javascriptreact': ['eslint', 'tsserver'],
\ 'css': ['stylelint'],
\ 'scss': ['stylelint'],
\ 'cloudformation': ['cfn-lint'],
\ 'yaml': ['yamllint']
\}
let g:ale_linter_aliases['astro'] = ['html', 'css', 'scss', 'javascript', 'typescript']
let g:ale_linter_aliases['sass'] = ['scss']
let g:ale_fixers['astro'] = ['prettier']
" let g:ale_fix_on_save = 0 " use coc-prettier
" let g:ale_completion_enabled = 0 " use coc completion
let g:ale_completion_enabled = 1
let g:ale_fix_on_save = 1

source ~/.vim/coc.vim

colorscheme carbonfox

nmap <silent> [e <Plug>(coc-diagnostic-prev)
nmap <silent> ]e <Plug>(coc-diagnostic-next)
nmap <silent> [g <Plug>(coc-diagnostic-prev)
nmap <silent> ]g <Plug>(coc-diagnostic-next)
