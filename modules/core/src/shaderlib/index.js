// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import {
  registerShaderModules,
  setDefaultShaderModules,
  createShaderHook,
  createModuleInjection
} from '@luma.gl/core';
import {fp32, fp64, picking, gouraudlighting, phonglighting} from '@luma.gl/core';
import geometry from './misc/geometry';
import project from './project/project';
import project32 from './project32/project32';
import project64 from './project64/project64';

export function initializeShaderModules() {
  registerShaderModules([fp32, fp64, project, project32, gouraudlighting, phonglighting, picking]);

  setDefaultShaderModules([geometry, project]);

  createShaderHook('vs:DECKGL_FILTER_SIZE(inout vec3 size, VertexGeometry geometry)');
  createShaderHook('vs:DECKGL_FILTER_GL_POSITION(inout vec4 position, VertexGeometry geometry)');
  createShaderHook('vs:DECKGL_FILTER_COLOR(inout vec4 color, VertexGeometry geometry)');
  createShaderHook('fs:DECKGL_FILTER_COLOR(inout vec4 color, FragmentGeometry geometry)');

  createModuleInjection('picking', {
    hook: 'fs:DECKGL_FILTER_COLOR',
    order: 99,
    injection: `
  // use highlight color if this fragment belongs to the selected object.
  color = picking_filterHighlightColor(color);

  // use picking color if rendering to picking FBO.
  color = picking_filterPickingColor(color);
`
  });
}

export {fp32, fp64, picking, project, project64, gouraudlighting, phonglighting};
