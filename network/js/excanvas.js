document.createElement("canvas").getContext ||
  (function () {
    function S() {
      return this.context_ || (this.context_ = new z(this));
    }
    function T(a, b, c) {
      var g = J.call(arguments, 2);
      return function () {
        return a.apply(b, g.concat(J.call(arguments)));
      };
    }
    function K(a) {
      return ("" + a).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
    }
    function L(a) {
      a.namespaces.g_vml_ ||
        a.namespaces.add(
          "g_vml_",
          "urn:schemas-microsoft-com:vml",
          "#default#VML"
        );
      a.namespaces.g_o_ ||
        a.namespaces.add(
          "g_o_",
          "urn:schemas-microsoft-com:office:office",
          "#default#VML"
        );
      a.styleSheets.ex_canvas_ ||
        ((a = a.createStyleSheet()),
        (a.owningElement.id = "ex_canvas_"),
        (a.cssText =
          "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}"));
    }
    function U(a) {
      var b = a.srcElement;
      switch (a.propertyName) {
        case "width":
          b.getContext().clearRect();
          b.style.width = b.attributes.width.nodeValue + "px";
          b.firstChild.style.width = b.clientWidth + "px";
          break;
        case "height":
          b.getContext().clearRect(),
            (b.style.height = b.attributes.height.nodeValue + "px"),
            (b.firstChild.style.height = b.clientHeight + "px");
      }
    }
    function V(a) {
      a = a.srcElement;
      a.firstChild &&
        ((a.firstChild.style.width = a.clientWidth + "px"),
        (a.firstChild.style.height = a.clientHeight + "px"));
    }
    function A() {
      return [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
    }
    function q(a, b) {
      for (var c = A(), g = 0; 3 > g; g++)
        for (var e = 0; 3 > e; e++) {
          for (var f = 0, d = 0; 3 > d; d++) f += a[g][d] * b[d][e];
          c[g][e] = f;
        }
      return c;
    }
    function M(a, b) {
      b.fillStyle = a.fillStyle;
      b.lineCap = a.lineCap;
      b.lineJoin = a.lineJoin;
      b.lineWidth = a.lineWidth;
      b.miterLimit = a.miterLimit;
      b.shadowBlur = a.shadowBlur;
      b.shadowColor = a.shadowColor;
      b.shadowOffsetX = a.shadowOffsetX;
      b.shadowOffsetY = a.shadowOffsetY;
      b.strokeStyle = a.strokeStyle;
      b.globalAlpha = a.globalAlpha;
      b.font = a.font;
      b.textAlign = a.textAlign;
      b.textBaseline = a.textBaseline;
      b.arcScaleX_ = a.arcScaleX_;
      b.arcScaleY_ = a.arcScaleY_;
      b.lineScale_ = a.lineScale_;
    }
    function N(a) {
      var b = a.indexOf("(", 3),
        c = a.indexOf(")", b + 1),
        b = a.substring(b + 1, c).split(",");
      if (4 != b.length || "a" != a.charAt(3)) b[3] = 1;
      return b;
    }
    function B(a, b, c) {
      return Math.min(c, Math.max(b, a));
    }
    function C(a, b, c) {
      0 > c && c++;
      1 < c && c--;
      return 1 > 6 * c
        ? a + 6 * (b - a) * c
        : 1 > 2 * c
        ? b
        : 2 > 3 * c
        ? a + 6 * (b - a) * (2 / 3 - c)
        : a;
    }
    function D(a) {
      if (a in E) return E[a];
      var b,
        c = 1,
        a = "" + a;
      if ("#" == a.charAt(0)) b = a;
      else if (/^rgb/.test(a)) {
        c = N(a);
        b = "#";
        for (var g, e = 0; 3 > e; e++)
          (g =
            -1 != c[e].indexOf("%")
              ? Math.floor(255 * (parseFloat(c[e]) / 100))
              : +c[e]),
            (b += s[B(g, 0, 255)]);
        c = +c[3];
      } else if (/^hsl/.test(a)) {
        e = c = N(a);
        b = (parseFloat(e[0]) / 360) % 360;
        0 > b && b++;
        g = B(parseFloat(e[1]) / 100, 0, 1);
        e = B(parseFloat(e[2]) / 100, 0, 1);
        if (0 == g) g = e = b = e;
        else {
          var f = 0.5 > e ? e * (1 + g) : e + g - e * g,
            d = 2 * e - f;
          g = C(d, f, b + 1 / 3);
          e = C(d, f, b);
          b = C(d, f, b - 1 / 3);
        }
        b =
          "#" +
          s[Math.floor(255 * g)] +
          s[Math.floor(255 * e)] +
          s[Math.floor(255 * b)];
        c = c[3];
      } else b = W[a] || a;
      return (E[a] = { color: b, alpha: c });
    }
    function z(a) {
      this.m_ = A();
      this.mStack_ = [];
      this.aStack_ = [];
      this.currentPath_ = [];
      this.fillStyle = this.strokeStyle = "#000";
      this.lineWidth = 1;
      this.lineJoin = "miter";
      this.lineCap = "butt";
      this.miterLimit = 1 * n;
      this.globalAlpha = 1;
      this.font = "10px sans-serif";
      this.textAlign = "left";
      this.textBaseline = "alphabetic";
      this.canvas = a;
      var b =
          "width:" +
          a.clientWidth +
          "px;height:" +
          a.clientHeight +
          "px;overflow:hidden;position:absolute",
        c = a.ownerDocument.createElement("div");
      c.style.cssText = b;
      a.appendChild(c);
      b = c.cloneNode(!1);
      b.style.backgroundColor = "red";
      b.style.filter = "alpha(opacity=0)";
      a.appendChild(b);
      this.element_ = c;
      this.lineScale_ = this.arcScaleY_ = this.arcScaleX_ = 1;
    }
    function O(a, b, c, g) {
      a.currentPath_.push({
        type: "bezierCurveTo",
        cp1x: b.x,
        cp1y: b.y,
        cp2x: c.x,
        cp2y: c.y,
        x: g.x,
        y: g.y,
      });
      a.currentX_ = g.x;
      a.currentY_ = g.y;
    }
    function P(a, b) {
      var c = D(a.strokeStyle),
        g = c.color,
        c = c.alpha * a.globalAlpha,
        e = a.lineScale_ * a.lineWidth;
      1 > e && (c *= e);
      b.push(
        "<g_vml_:stroke",
        ' opacity="',
        c,
        '"',
        ' joinstyle="',
        a.lineJoin,
        '"',
        ' miterlimit="',
        a.miterLimit,
        '"',
        ' endcap="',
        X[a.lineCap] || "square",
        '"',
        ' weight="',
        e,
        'px"',
        ' color="',
        g,
        '" />'
      );
    }
    function Q(a, b, c, g) {
      var e = a.fillStyle,
        f = a.arcScaleX_,
        d = a.arcScaleY_,
        h = g.x - c.x,
        l = g.y - c.y;
      if (e instanceof t) {
        var i = 0,
          j = (g = 0),
          r = 0,
          k = 1;
        if ("gradient" == e.type_) {
          var i = e.x1_ / f,
            c = e.y1_ / d,
            m = p(a, e.x0_ / f, e.y0_ / d),
            i = p(a, i, c),
            i = (180 * Math.atan2(i.x - m.x, i.y - m.y)) / Math.PI;
          0 > i && (i += 360);
          1.0e-6 > i && (i = 0);
        } else
          (m = p(a, e.x0_, e.y0_)),
            (g = (m.x - c.x) / h),
            (j = (m.y - c.y) / l),
            (h /= f * n),
            (l /= d * n),
            (k = u.max(h, l)),
            (r = (2 * e.r0_) / k),
            (k = (2 * e.r1_) / k - r);
        f = e.colors_;
        f.sort(function (a, b) {
          return a.offset - b.offset;
        });
        for (
          var d = f.length,
            m = f[0].color,
            c = f[d - 1].color,
            h = f[0].alpha * a.globalAlpha,
            a = f[d - 1].alpha * a.globalAlpha,
            l = [],
            o = 0;
          o < d;
          o++
        ) {
          var q = f[o];
          l.push(q.offset * k + r + " " + q.color);
        }
        b.push(
          '<g_vml_:fill type="',
          e.type_,
          '"',
          ' method="none" focus="100%"',
          ' color="',
          m,
          '"',
          ' color2="',
          c,
          '"',
          ' colors="',
          l.join(","),
          '"',
          ' opacity="',
          a,
          '"',
          ' g_o_:opacity2="',
          h,
          '"',
          ' angle="',
          i,
          '"',
          ' focusposition="',
          g,
          ",",
          j,
          '" />'
        );
      } else
        e instanceof F
          ? h &&
            l &&
            b.push(
              "<g_vml_:fill",
              ' position="',
              (-c.x / h) * f * f,
              ",",
              (-c.y / l) * d * d,
              '"',
              ' type="tile"',
              ' src="',
              e.src_,
              '" />'
            )
          : ((e = D(a.fillStyle)),
            b.push(
              '<g_vml_:fill color="',
              e.color,
              '" opacity="',
              e.alpha * a.globalAlpha,
              '" />'
            ));
    }
    function p(a, b, c) {
      a = a.m_;
      return {
        x: n * (b * a[0][0] + c * a[1][0] + a[2][0]) - o,
        y: n * (b * a[0][1] + c * a[1][1] + a[2][1]) - o,
      };
    }
    function w(a, b, c) {
      isFinite(b[0][0]) &&
        isFinite(b[0][1]) &&
        isFinite(b[1][0]) &&
        isFinite(b[1][1]) &&
        isFinite(b[2][0]) &&
        isFinite(b[2][1]) &&
        ((a.m_ = b),
        c && (a.lineScale_ = Y(Z(b[0][0] * b[1][1] - b[0][1] * b[1][0]))));
    }
    function t(a) {
      this.type_ = a;
      this.r1_ = this.y1_ = this.x1_ = this.r0_ = this.y0_ = this.x0_ = 0;
      this.colors_ = [];
    }
    function F(a, b) {
      if (!a || 1 != a.nodeType || "IMG" != a.tagName)
        throw new x("TYPE_MISMATCH_ERR");
      if ("complete" != a.readyState) throw new x("INVALID_STATE_ERR");
      switch (b) {
        case "repeat":
        case null:
        case "":
          this.repetition_ = "repeat";
          break;
        case "repeat-x":
        case "repeat-y":
        case "no-repeat":
          this.repetition_ = b;
          break;
        default:
          throw new x("SYNTAX_ERR");
      }
      this.src_ = a.src;
      this.width_ = a.width;
      this.height_ = a.height;
    }
    function x(a) {
      this.code = this[a];
      this.message = a + ": DOM Exception " + this.code;
    }
    var u = Math,
      h = u.round,
      G = u.sin,
      H = u.cos,
      Z = u.abs,
      Y = u.sqrt,
      n = 10,
      o = n / 2;
    navigator.userAgent.match(/MSIE ([\d.]+)?/);
    var J = Array.prototype.slice;
    L(document);
    var R = {
      init: function (a) {
        a = a || document;
        a.createElement("canvas");
        a.attachEvent("onreadystatechange", T(this.init_, this, a));
      },
      init_: function (a) {
        for (var a = a.getElementsByTagName("canvas"), b = 0; b < a.length; b++)
          this.initElement(a[b]);
      },
      initElement: function (a) {
        if (!a.getContext) {
          a.getContext = S;
          L(a.ownerDocument);
          a.innerHTML = "";
          a.attachEvent("onpropertychange", U);
          a.attachEvent("onresize", V);
          var b = a.attributes;
          b.width && b.width.specified
            ? (a.style.width = b.width.nodeValue + "px")
            : (a.width = a.clientWidth);
          b.height && b.height.specified
            ? (a.style.height = b.height.nodeValue + "px")
            : (a.height = a.clientHeight);
        }
        return a;
      },
    };
    R.init();
    for (var s = [], d = 0; 16 > d; d++)
      for (var y = 0; 16 > y; y++)
        s[16 * d + y] = d.toString(16) + y.toString(16);
    var W = {
        aliceblue: "#F0F8FF",
        antiquewhite: "#FAEBD7",
        aquamarine: "#7FFFD4",
        azure: "#F0FFFF",
        beige: "#F5F5DC",
        bisque: "#FFE4C4",
        black: "#000000",
        blanchedalmond: "#FFEBCD",
        blueviolet: "#8A2BE2",
        brown: "#A52A2A",
        burlywood: "#DEB887",
        cadetblue: "#5F9EA0",
        chartreuse: "#7FFF00",
        chocolate: "#D2691E",
        coral: "#FF7F50",
        cornflowerblue: "#6495ED",
        cornsilk: "#FFF8DC",
        crimson: "#DC143C",
        cyan: "#00FFFF",
        darkblue: "#00008B",
        darkcyan: "#008B8B",
        darkgoldenrod: "#B8860B",
        darkgray: "#A9A9A9",
        darkgreen: "#006400",
        darkgrey: "#A9A9A9",
        darkkhaki: "#BDB76B",
        darkmagenta: "#8B008B",
        darkolivegreen: "#556B2F",
        darkorange: "#FF8C00",
        darkorchid: "#9932CC",
        darkred: "#8B0000",
        darksalmon: "#E9967A",
        darkseagreen: "#8FBC8F",
        darkslateblue: "#483D8B",
        darkslategray: "#2F4F4F",
        darkslategrey: "#2F4F4F",
        darkturquoise: "#00CED1",
        darkviolet: "#9400D3",
        deeppink: "#FF1493",
        deepskyblue: "#00BFFF",
        dimgray: "#696969",
        dimgrey: "#696969",
        dodgerblue: "#1E90FF",
        firebrick: "#B22222",
        floralwhite: "#FFFAF0",
        forestgreen: "#228B22",
        gainsboro: "#DCDCDC",
        ghostwhite: "#F8F8FF",
        gold: "#FFD700",
        goldenrod: "#DAA520",
        grey: "#808080",
        greenyellow: "#ADFF2F",
        honeydew: "#F0FFF0",
        hotpink: "#FF69B4",
        indianred: "#CD5C5C",
        indigo: "#4B0082",
        ivory: "#FFFFF0",
        khaki: "#F0E68C",
        lavender: "#E6E6FA",
        lavenderblush: "#FFF0F5",
        lawngreen: "#7CFC00",
        lemonchiffon: "#FFFACD",
        lightblue: "#ADD8E6",
        lightcoral: "#F08080",
        lightcyan: "#E0FFFF",
        lightgoldenrodyellow: "#FAFAD2",
        lightgreen: "#90EE90",
        lightgrey: "#D3D3D3",
        lightpink: "#FFB6C1",
        lightsalmon: "#FFA07A",
        lightseagreen: "#20B2AA",
        lightskyblue: "#87CEFA",
        lightslategray: "#778899",
        lightslategrey: "#778899",
        lightsteelblue: "#B0C4DE",
        lightyellow: "#FFFFE0",
        limegreen: "#32CD32",
        linen: "#FAF0E6",
        magenta: "#FF00FF",
        mediumaquamarine: "#66CDAA",
        mediumblue: "#0000CD",
        mediumorchid: "#BA55D3",
        mediumpurple: "#9370DB",
        mediumseagreen: "#3CB371",
        mediumslateblue: "#7B68EE",
        mediumspringgreen: "#00FA9A",
        mediumturquoise: "#48D1CC",
        mediumvioletred: "#C71585",
        midnightblue: "#191970",
        mintcream: "#F5FFFA",
        mistyrose: "#FFE4E1",
        moccasin: "#FFE4B5",
        navajowhite: "#FFDEAD",
        oldlace: "#FDF5E6",
        olivedrab: "#6B8E23",
        orange: "#FFA500",
        orangered: "#FF4500",
        orchid: "#DA70D6",
        palegoldenrod: "#EEE8AA",
        palegreen: "#98FB98",
        paleturquoise: "#AFEEEE",
        palevioletred: "#DB7093",
        papayawhip: "#FFEFD5",
        peachpuff: "#FFDAB9",
        peru: "#CD853F",
        pink: "#FFC0CB",
        plum: "#DDA0DD",
        powderblue: "#B0E0E6",
        rosybrown: "#BC8F8F",
        royalblue: "#4169E1",
        saddlebrown: "#8B4513",
        salmon: "#FA8072",
        sandybrown: "#F4A460",
        seagreen: "#2E8B57",
        seashell: "#FFF5EE",
        sienna: "#A0522D",
        skyblue: "#87CEEB",
        slateblue: "#6A5ACD",
        slategray: "#708090",
        slategrey: "#708090",
        snow: "#FFFAFA",
        springgreen: "#00FF7F",
        steelblue: "#4682B4",
        tan: "#D2B48C",
        thistle: "#D8BFD8",
        tomato: "#FF6347",
        turquoise: "#40E0D0",
        violet: "#EE82EE",
        wheat: "#F5DEB3",
        whitesmoke: "#F5F5F5",
        yellowgreen: "#9ACD32",
      },
      E = {},
      I = {},
      X = { butt: "flat", round: "round" },
      d = z.prototype;
    d.clearRect = function () {
      this.textMeasureEl_ &&
        (this.textMeasureEl_.removeNode(!0), (this.textMeasureEl_ = null));
      this.element_.innerHTML = "";
    };
    d.beginPath = function () {
      this.currentPath_ = [];
    };
    d.moveTo = function (a, b) {
      var c = p(this, a, b);
      this.currentPath_.push({ type: "moveTo", x: c.x, y: c.y });
      this.currentX_ = c.x;
      this.currentY_ = c.y;
    };
    d.lineTo = function (a, b) {
      var c = p(this, a, b);
      this.currentPath_.push({ type: "lineTo", x: c.x, y: c.y });
      this.currentX_ = c.x;
      this.currentY_ = c.y;
    };
    d.bezierCurveTo = function (a, b, c, g, e, f) {
      e = p(this, e, f);
      a = p(this, a, b);
      c = p(this, c, g);
      O(this, a, c, e);
    };
    d.quadraticCurveTo = function (a, b, c, g) {
      a = p(this, a, b);
      c = p(this, c, g);
      g = {
        x: this.currentX_ + (2 / 3) * (a.x - this.currentX_),
        y: this.currentY_ + (2 / 3) * (a.y - this.currentY_),
      };
      O(
        this,
        g,
        {
          x: g.x + (c.x - this.currentX_) / 3,
          y: g.y + (c.y - this.currentY_) / 3,
        },
        c
      );
    };
    d.arc = function (a, b, c, g, e, f) {
      var c = c * n,
        d = f ? "at" : "wa",
        h = a + H(g) * c - o,
        l = b + G(g) * c - o,
        g = a + H(e) * c - o,
        e = b + G(e) * c - o;
      h == g && !f && (h += 0.125);
      a = p(this, a, b);
      h = p(this, h, l);
      g = p(this, g, e);
      this.currentPath_.push({
        type: d,
        x: a.x,
        y: a.y,
        radius: c,
        xStart: h.x,
        yStart: h.y,
        xEnd: g.x,
        yEnd: g.y,
      });
    };
    d.rect = function (a, b, c, g) {
      this.moveTo(a, b);
      this.lineTo(a + c, b);
      this.lineTo(a + c, b + g);
      this.lineTo(a, b + g);
      this.closePath();
    };
    d.strokeRect = function (a, b, c, g) {
      var e = this.currentPath_;
      this.beginPath();
      this.moveTo(a, b);
      this.lineTo(a + c, b);
      this.lineTo(a + c, b + g);
      this.lineTo(a, b + g);
      this.closePath();
      this.stroke();
      this.currentPath_ = e;
    };
    d.fillRect = function (a, b, c, g) {
      var e = this.currentPath_;
      this.beginPath();
      this.moveTo(a, b);
      this.lineTo(a + c, b);
      this.lineTo(a + c, b + g);
      this.lineTo(a, b + g);
      this.closePath();
      this.fill();
      this.currentPath_ = e;
    };
    d.createLinearGradient = function (a, b, c, g) {
      var e = new t("gradient");
      e.x0_ = a;
      e.y0_ = b;
      e.x1_ = c;
      e.y1_ = g;
      return e;
    };
    d.createRadialGradient = function (a, b, c, g, e, f) {
      var d = new t("gradientradial");
      d.x0_ = a;
      d.y0_ = b;
      d.r0_ = c;
      d.x1_ = g;
      d.y1_ = e;
      d.r1_ = f;
      return d;
    };
    d.drawImage = function (a, b) {
      var c, g, e, d, o, v, l, i;
      e = a.runtimeStyle.width;
      d = a.runtimeStyle.height;
      a.runtimeStyle.width = "auto";
      a.runtimeStyle.height = "auto";
      var j = a.width,
        r = a.height;
      a.runtimeStyle.width = e;
      a.runtimeStyle.height = d;
      if (3 == arguments.length)
        (c = arguments[1]),
          (g = arguments[2]),
          (o = v = 0),
          (l = e = j),
          (i = d = r);
      else if (5 == arguments.length)
        (c = arguments[1]),
          (g = arguments[2]),
          (e = arguments[3]),
          (d = arguments[4]),
          (o = v = 0),
          (l = j),
          (i = r);
      else if (9 == arguments.length)
        (o = arguments[1]),
          (v = arguments[2]),
          (l = arguments[3]),
          (i = arguments[4]),
          (c = arguments[5]),
          (g = arguments[6]),
          (e = arguments[7]),
          (d = arguments[8]);
      else throw Error("Invalid number of arguments");
      var k = p(this, c, g),
        m = [];
      m.push(
        " <g_vml_:group",
        ' coordsize="',
        10 * n,
        ",",
        10 * n,
        '"',
        ' coordorigin="0,0"',
        ' style="width:',
        10,
        "px;height:",
        10,
        "px;position:absolute;"
      );
      if (
        1 != this.m_[0][0] ||
        this.m_[0][1] ||
        1 != this.m_[1][1] ||
        this.m_[1][0]
      ) {
        var q = [];
        q.push(
          "M11=",
          this.m_[0][0],
          ",",
          "M12=",
          this.m_[1][0],
          ",",
          "M21=",
          this.m_[0][1],
          ",",
          "M22=",
          this.m_[1][1],
          ",",
          "Dx=",
          h(k.x / n),
          ",",
          "Dy=",
          h(k.y / n),
          ""
        );
        var s = p(this, c + e, g),
          t = p(this, c, g + d);
        c = p(this, c + e, g + d);
        k.x = u.max(k.x, s.x, t.x, c.x);
        k.y = u.max(k.y, s.y, t.y, c.y);
        m.push(
          "padding:0 ",
          h(k.x / n),
          "px ",
          h(k.y / n),
          "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(",
          q.join(""),
          ", sizingmethod='clip');"
        );
      } else m.push("top:", h(k.y / n), "px;left:", h(k.x / n), "px;");
      m.push(
        ' ">',
        '<g_vml_:image src="',
        a.src,
        '"',
        ' style="width:',
        n * e,
        "px;",
        " height:",
        n * d,
        'px"',
        ' cropleft="',
        o / j,
        '"',
        ' croptop="',
        v / r,
        '"',
        ' cropright="',
        (j - o - l) / j,
        '"',
        ' cropbottom="',
        (r - v - i) / r,
        '"',
        " />",
        "</g_vml_:group>"
      );
      this.element_.insertAdjacentHTML("BeforeEnd", m.join(""));
    };
    d.stroke = function (a) {
      var b = [];
      b.push(
        "<g_vml_:shape",
        ' filled="',
        !!a,
        '"',
        ' style="position:absolute;width:',
        10,
        "px;height:",
        10,
        'px;"',
        ' coordorigin="0,0"',
        ' coordsize="',
        10 * n,
        ",",
        10 * n,
        '"',
        ' stroked="',
        !a,
        '"',
        ' path="'
      );
      for (
        var c = { x: null, y: null }, d = { x: null, y: null }, e = 0;
        e < this.currentPath_.length;
        e++
      ) {
        var f = this.currentPath_[e];
        switch (f.type) {
          case "moveTo":
            b.push(" m ", h(f.x), ",", h(f.y));
            break;
          case "lineTo":
            b.push(" l ", h(f.x), ",", h(f.y));
            break;
          case "close":
            b.push(" x ");
            f = null;
            break;
          case "bezierCurveTo":
            b.push(
              " c ",
              h(f.cp1x),
              ",",
              h(f.cp1y),
              ",",
              h(f.cp2x),
              ",",
              h(f.cp2y),
              ",",
              h(f.x),
              ",",
              h(f.y)
            );
            break;
          case "at":
          case "wa":
            b.push(
              " ",
              f.type,
              " ",
              h(f.x - this.arcScaleX_ * f.radius),
              ",",
              h(f.y - this.arcScaleY_ * f.radius),
              " ",
              h(f.x + this.arcScaleX_ * f.radius),
              ",",
              h(f.y + this.arcScaleY_ * f.radius),
              " ",
              h(f.xStart),
              ",",
              h(f.yStart),
              " ",
              h(f.xEnd),
              ",",
              h(f.yEnd)
            );
        }
        if (f) {
          if (null == c.x || f.x < c.x) c.x = f.x;
          if (null == d.x || f.x > d.x) d.x = f.x;
          if (null == c.y || f.y < c.y) c.y = f.y;
          if (null == d.y || f.y > d.y) d.y = f.y;
        }
      }
      b.push(' ">');
      a ? Q(this, b, c, d) : P(this, b);
      b.push("</g_vml_:shape>");
      this.element_.insertAdjacentHTML("beforeEnd", b.join(""));
    };
    d.fill = function () {
      this.stroke(!0);
    };
    d.closePath = function () {
      this.currentPath_.push({ type: "close" });
    };
    d.save = function () {
      var a = {};
      M(this, a);
      this.aStack_.push(a);
      this.mStack_.push(this.m_);
      this.m_ = q(A(), this.m_);
    };
    d.restore = function () {
      this.aStack_.length &&
        (M(this.aStack_.pop(), this), (this.m_ = this.mStack_.pop()));
    };
    d.translate = function (a, b) {
      w(
        this,
        q(
          [
            [1, 0, 0],
            [0, 1, 0],
            [a, b, 1],
          ],
          this.m_
        ),
        !1
      );
    };
    d.rotate = function (a) {
      var b = H(a),
        a = G(a);
      w(
        this,
        q(
          [
            [b, a, 0],
            [-a, b, 0],
            [0, 0, 1],
          ],
          this.m_
        ),
        !1
      );
    };
    d.scale = function (a, b) {
      this.arcScaleX_ *= a;
      this.arcScaleY_ *= b;
      w(
        this,
        q(
          [
            [a, 0, 0],
            [0, b, 0],
            [0, 0, 1],
          ],
          this.m_
        ),
        !0
      );
    };
    d.transform = function (a, b, c, d, e, f) {
      w(
        this,
        q(
          [
            [a, b, 0],
            [c, d, 0],
            [e, f, 1],
          ],
          this.m_
        ),
        !0
      );
    };
    d.setTransform = function (a, b, c, d, e, f) {
      w(
        this,
        [
          [a, b, 0],
          [c, d, 0],
          [e, f, 1],
        ],
        !0
      );
    };
    d.drawText_ = function (a, b, c, d, e) {
      var f = this.m_,
        d = 0,
        o = 1e3,
        q = 0,
        l = [],
        i;
      i = this.font;
      if (I[i]) i = I[i];
      else {
        var j = document.createElement("div").style;
        try {
          j.font = i;
        } catch (r) {}
        i = I[i] = {
          style: j.fontStyle || "normal",
          variant: j.fontVariant || "normal",
          weight: j.fontWeight || "normal",
          size: j.fontSize || 10,
          family: j.fontFamily || "sans-serif",
        };
      }
      var j = i,
        k = this.element_;
      i = {};
      for (var m in j) i[m] = j[m];
      m = parseFloat(k.currentStyle.fontSize);
      k = parseFloat(j.size);
      i.size =
        "number" == typeof j.size
          ? j.size
          : -1 != j.size.indexOf("px")
          ? k
          : -1 != j.size.indexOf("em")
          ? m * k
          : -1 != j.size.indexOf("%")
          ? (m / 100) * k
          : -1 != j.size.indexOf("pt")
          ? k / 0.75
          : m;
      i.size *= 0.981;
      m =
        i.style +
        " " +
        i.variant +
        " " +
        i.weight +
        " " +
        i.size +
        "px " +
        i.family;
      k = this.element_.currentStyle;
      j = this.textAlign.toLowerCase();
      switch (j) {
        case "left":
        case "center":
        case "right":
          break;
        case "end":
          j = "ltr" == k.direction ? "right" : "left";
          break;
        case "start":
          j = "rtl" == k.direction ? "right" : "left";
          break;
        default:
          j = "left";
      }
      switch (this.textBaseline) {
        case "hanging":
        case "top":
          q = i.size / 1.75;
          break;
        case "middle":
          break;
        default:
        case null:
        case "alphabetic":
        case "ideographic":
        case "bottom":
          q = -i.size / 2.25;
      }
      switch (j) {
        case "right":
          d = 1e3;
          o = 0.05;
          break;
        case "center":
          d = o = 500;
      }
      b = p(this, b + 0, c + q);
      l.push(
        '<g_vml_:line from="',
        -d,
        ' 0" to="',
        o,
        ' 0.05" ',
        ' coordsize="100 100" coordorigin="0 0"',
        ' filled="',
        !e,
        '" stroked="',
        !!e,
        '" style="position:absolute;width:1px;height:1px;">'
      );
      e ? P(this, l) : Q(this, l, { x: -d, y: 0 }, { x: o, y: i.size });
      e =
        f[0][0].toFixed(3) +
        "," +
        f[1][0].toFixed(3) +
        "," +
        f[0][1].toFixed(3) +
        "," +
        f[1][1].toFixed(3) +
        ",0,0";
      b = h(b.x / n) + "," + h(b.y / n);
      l.push(
        '<g_vml_:skew on="t" matrix="',
        e,
        '" ',
        ' offset="',
        b,
        '" origin="',
        d,
        ' 0" />',
        '<g_vml_:path textpathok="true" />',
        '<g_vml_:textpath on="true" string="',
        K(a),
        '" style="v-text-align:',
        j,
        ";font:",
        K(m),
        '" /></g_vml_:line>'
      );
      this.element_.insertAdjacentHTML("beforeEnd", l.join(""));
    };
    d.fillText = function (a, b, c, d) {
      this.drawText_(a, b, c, d, !1);
    };
    d.strokeText = function (a, b, c, d) {
      this.drawText_(a, b, c, d, !0);
    };
    d.measureText = function (a) {
      this.textMeasureEl_ ||
        (this.element_.insertAdjacentHTML(
          "beforeEnd",
          '<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>'
        ),
        (this.textMeasureEl_ = this.element_.lastChild));
      var b = this.element_.ownerDocument;
      this.textMeasureEl_.innerHTML = "";
      this.textMeasureEl_.style.font = this.font;
      this.textMeasureEl_.appendChild(b.createTextNode(a));
      return { width: this.textMeasureEl_.offsetWidth };
    };
    d.clip = function () {};
    d.arcTo = function () {};
    d.createPattern = function (a, b) {
      return new F(a, b);
    };
    t.prototype.addColorStop = function (a, b) {
      b = D(b);
      this.colors_.push({ offset: a, color: b.color, alpha: b.alpha });
    };
    d = x.prototype = Error();
    d.INDEX_SIZE_ERR = 1;
    d.DOMSTRING_SIZE_ERR = 2;
    d.HIERARCHY_REQUEST_ERR = 3;
    d.WRONG_DOCUMENT_ERR = 4;
    d.INVALID_CHARACTER_ERR = 5;
    d.NO_DATA_ALLOWED_ERR = 6;
    d.NO_MODIFICATION_ALLOWED_ERR = 7;
    d.NOT_FOUND_ERR = 8;
    d.NOT_SUPPORTED_ERR = 9;
    d.INUSE_ATTRIBUTE_ERR = 10;
    d.INVALID_STATE_ERR = 11;
    d.SYNTAX_ERR = 12;
    d.INVALID_MODIFICATION_ERR = 13;
    d.NAMESPACE_ERR = 14;
    d.INVALID_ACCESS_ERR = 15;
    d.VALIDATION_ERR = 16;
    d.TYPE_MISMATCH_ERR = 17;
    G_vmlCanvasManager = R;
    CanvasRenderingContext2D = z;
    CanvasGradient = t;
    CanvasPattern = F;
    DOMException = x;
  })();
