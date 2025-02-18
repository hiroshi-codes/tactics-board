import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { format } from "date-fns";
import { enqueueSnackbar } from "notistack";
import { MdAdd, MdDelete, MdFileUpload, MdHelp, MdPlayArrow, MdRemove, MdSave } from "react-icons/md";

import appLogo from "/pwa-64x64.png";
import basketballSvg from "/basketball.svg";
import red1Svg from "/red1.svg";
import red2Svg from "/red2.svg";
import red3Svg from "/red3.svg";
import red4Svg from "/red4.svg";
import red5Svg from "/red5.svg";
import blue1Svg from "/blue1.svg";
import blue2Svg from "/blue2.svg";
import blue3Svg from "/blue3.svg";
import blue4Svg from "/blue4.svg";
import blue5Svg from "/blue5.svg";

import Help from "./Help";
import IconButton from "./IconButton";

interface Position {
  x: number;
  y: number;
}

const size = 40 as const;
const canvasSize = {
  width: screen.width < 480 ? screen.width : 480,
  height: screen.width < 480 ? 550 : 700,
} as const;

const firstPosition = {
  x: size / 2 + 40,
  y: screen.width < 480 ? 480 : 600,
};
const images: {
  [key: string]: HTMLImageElement;
} = {
  ball: await loadImage(basketballSvg),
  red1: await loadImage(red1Svg),
  red2: await loadImage(red2Svg),
  red3: await loadImage(red3Svg),
  red4: await loadImage(red4Svg),
  red5: await loadImage(red5Svg),
  blue1: await loadImage(blue1Svg),
  blue2: await loadImage(blue2Svg),
  blue3: await loadImage(blue3Svg),
  blue4: await loadImage(blue4Svg),
  blue5: await loadImage(blue5Svg),
};
const initialPosition: {
  [key: string]: Position;
} = {
  ball: {
    x: firstPosition.x + (size + 10) * 5,
    y: firstPosition.y,
  },
};
for (let index = 1; index <= 5; index++) {
  const addX = (size + 10) * (index - 1);
  initialPosition[`red${index}`] = {
    x: firstPosition.x + addX,
    y: firstPosition.y,
  };

  initialPosition[`blue${index}`] = {
    x: firstPosition.x + addX,
    y: firstPosition.y + size + 10,
  };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

async function jsonFileExport(exportJson: object, fileName = "download.json") {
  const data = new Blob([JSON.stringify(exportJson)], { type: "text/json" });
  const jsonURL = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = jsonURL;
  link.setAttribute("download", fileName);
  link.click();
  document.body.removeChild(link);
}

function jsonFileImport(file: File): Promise<{
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
}> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const json = JSON.parse(content);

      try {
        resolve({
          success: true,
          message: "インポートしました",
          data: json,
        });
      } catch (error) {
        console.error("JSONファイルを解析できませんでした。", error);
        resolve({
          success: false,
          message: "JSONファイルを解析できませんでした。",
          data: null,
        });
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
}

function HalfCourt() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [render, setRender] = React.useState(false);
  const [drug, setDrug] = React.useState(false);
  const [help, setHelp] = React.useState(false);
  const targetKey = React.useRef("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const newPosition = React.useRef<{ [key: string]: Position }>(initialPosition);
  const positions = React.useRef<{ [key: string]: Position }[]>([initialPosition]);

  useEffect(() => {
    if (!canvasRef.current) {
      throw new Error("canvas要素の取得に失敗しました");
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("context取得失敗");
    }

    //描画前に既に描画済みのものを消してリセット
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (newPosition.current) {
      for (const [key, value] of Object.entries(newPosition.current)) {
        ctx.drawImage(images[key], value.x - size / 2, value.y - size / 2, size, size);
      }
    }
  }, [render, drug]);

  const StartMove: React.PointerEventHandler<HTMLCanvasElement> = (e) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const hit = Object.entries(newPosition.current).some(([key, value]) => {
      const check =
        value.x <= point.x + size / 2 &&
        point.x <= value.x + size / 2 && // 横方向の判定
        value.y <= point.y + size / 2 &&
        point.y <= value.y + size / 2; // 縦方向の判定
      if (check) {
        targetKey.current = key;
      }
      return check;
    });
    if (hit) {
      setDrug(true);
    }
  };

  const EndMove = () => {
    setDrug(false);
  };

  const Move: React.MouseEventHandler<HTMLCanvasElement> = (e) => {
    //変数drugがtrueの場合座標を更新する
    if (drug && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect(); //キャンバスの位置取得
      const target = newPosition.current[targetKey.current];
      newPosition.current = {
        ...newPosition.current,
        [targetKey.current]: {
          ...target,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
      };
      setRender(!render);
    }
  };
  const TouchMove: React.TouchEventHandler<HTMLCanvasElement> = (e) => {
    e.stopPropagation();
    //変数drugがtrueの場合座標を更新する
    if (drug && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect(); //キャンバスの位置取得
      const target = newPosition.current[targetKey.current];
      newPosition.current = {
        ...newPosition.current,
        [targetKey.current]: {
          ...target,
          x: e.changedTouches[0].clientX - rect.left,
          y: e.changedTouches[0].clientY - rect.top,
        },
      };
      setRender(!render);
    }
  };
  const add = () => {
    positions.current.push(newPosition.current);
    setRender(!render);
    enqueueSnackbar(`${positions.current.length - 1}フレーム目、登録しました`, { autoHideDuration: 1000 });
  };

  const remove = () => {
    if (positions.current.length === 1) {
      return;
    }
    positions.current.pop();
    newPosition.current = positions.current.slice(-1)[0];

    setRender(!render);
    enqueueSnackbar(`${positions.current.length}フレーム目、削除しました`, { autoHideDuration: 1000 });
  };

  const play = () => {
    const position: {
      [key: string]: Position;
    } = JSON.parse(JSON.stringify(positions.current[1]));
    if (!position) {
      return;
    }
    let loop = 0;
    const render = (index: number) => {
      if (!canvasRef.current) {
        throw new Error("canvas要素の取得に失敗しました");
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("context取得失敗");
      }
      const firstPosition = positions.current[index];
      const nextPosition = positions.current[index + 1];
      if (!nextPosition) {
        return;
      }

      //描画前に既に描画済みのものを消してリセット
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      let next = 0;
      for (const [key, value] of Object.entries(firstPosition)) {
        const nextValue = nextPosition[key];
        const diffX = (nextValue.x - value.x) / 100;
        const diffY = (nextValue.y - value.y) / 100;
        if (loop > 0) {
          position[key].x += diffX;
          position[key].y += diffY;
        }
        if ((diffX >= 0 && nextValue.x <= position[key].x) || (diffX <= 0 && nextValue.x >= position[key].x)) {
          next += 1;
          ctx.drawImage(images[key], nextValue.x - size / 2, nextValue.y - size / 2, size, size);
        } else {
          ctx.drawImage(images[key], position[key].x - size / 2, position[key].y - size / 2, size, size);
        }
      }
      ctx.font = "24px serif";
      ctx.fillStyle = "white";
      ctx.fillText(`${String(index)} → ${String(index + 1)}`, 20, 40);

      loop += 1;
      if (Object.keys(firstPosition).length === next) {
        // 次の場所
        requestAnimationFrame(() => render(index + 1));
      } else {
        requestAnimationFrame(() => render(index));
      }
    };
    render(1);
  };

  const clear = () => {
    positions.current = [initialPosition];
    newPosition.current = initialPosition;
    setRender(!render);
  };

  const download = () => {
    const fileName = `tactics-board_${format(new Date(), "yyyyMMddhhmmss")}.json`;
    jsonFileExport(positions.current, fileName);
  };

  const inputClick = () => {
    inputRef.current?.click();
  };

  const upload: React.ChangeEventHandler<HTMLInputElement> | undefined = async (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      e.target.value = "";
      return;
    }

    const file = e.target.files[0];
    const result = await jsonFileImport(file);
    if (result.success) {
      positions.current = result.data;
      newPosition.current = positions.current.slice(-1)[0];
      setRender(!render);
    }
    e.target.value = "";
  };

  return (
    <>
      <Help show={help} onClose={() => setHelp(false)} />
      <div className="flex justify-center">
        <div>
          <div className="flex justify-between items-center p-2">
            <Link to="/" className="flex items-center">
              <img src={appLogo} alt="tactics-board logo" width="35" height="35" />
              tactics board
            </Link>
            <div>
              <IconButton Icon={MdHelp} color="lime" buttonProps={{ onClick: () => setHelp(true) }} />
              <IconButton Icon={MdSave} color="lime" buttonProps={{ onClick: download }} className="ml-2" />
              <IconButton Icon={MdFileUpload} color="lime" buttonProps={{ onClick: inputClick }} className="ml-2">
                <input type="file" accept=".json" onChange={upload} className="hidden" ref={inputRef} />
              </IconButton>
            </div>
          </div>
          <div className="flex justify-between items-center px-2">
            <div>
              <IconButton Icon={MdAdd} color="blue" size={25} buttonProps={{ onClick: add }} />
              <IconButton Icon={MdRemove} color="red" size={25} buttonProps={{ onClick: remove }} className="ml-4" />
              <IconButton Icon={MdPlayArrow} color="green" size={25} buttonProps={{ onClick: play }} className="ml-4" />
              <IconButton Icon={MdDelete} color="red" size={25} buttonProps={{ onClick: clear }} className="ml-4" />
            </div>
            <div className="text-white">{positions.current.length - 1} フレーム</div>
          </div>
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onPointerDown={StartMove}
            onMouseMove={Move}
            onTouchMove={TouchMove}
            onMouseUp={EndMove}
            onTouchEnd={EndMove}
            className="bg-[url(/half-court.png)] bg-contain bg-no-repeat"
          />
        </div>
      </div>
    </>
  );
}

export default HalfCourt;
