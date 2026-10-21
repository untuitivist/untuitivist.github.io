// Project content follows the confirmed project materials.
export const projects = {
  "pcastnet": {
    "category": {
      "en": "PHYSICAL SIGNALS / GENERATIVE LEARNING",
      "zh": "物理信号 / 生成学习"
    },
    "title": {
      "en": "PCASTNet",
      "zh": "PCASTNet · 跨设备故障样本生成"
    },
    "summary": {
      "en": "Physics-constrained adaptive style transfer for sample generation in cross-machine, small-sample fault diagnosis.",
      "zh": "通过物理约束的自适应风格迁移，为跨设备小样本故障诊断生成样本。"
    },
    "image": "images/projects/pcastnet-overview.webp",
    "alt": {
      "en": "Original PCASTNet research slide showing the challenge, architecture and sample comparisons.",
      "zh": "PCASTNet 研究原始展示图，包括问题、模型架构与生成样本比较。"
    },
    "caption": {
      "en": "Research overview from the project presentation. The network separates fault content and machine style, with a band-energy preservation constraint.",
      "zh": "项目演示中的研究概览：分离故障内容与设备风格，并引入频带能量保持约束。"
    },
    "work": {
      "en": "Research on time-frequency representations, style transfer and adaptive style normalization (AdaSN). The generation process jointly considers content, style and physical band-energy consistency.",
      "zh": "研究时频表示、风格迁移与自适应风格归一化（AdaSN），在生成过程中同时考虑故障内容、设备风格与频带能量的物理一致性。"
    },
    "result": {
      "en": "PCASTNet appears in IEEE Transactions on Instrumentation and Measurement, volume 74, article 3568417. The project also includes the published patent application CN121327484A.",
      "zh": "PCASTNet 收录于 IEEE Transactions on Instrumentation and Measurement，第 74 卷，文章号 3568417。项目相关发明专利申请已公开，公开号为 CN121327484A。"
    },
    "links": [
      {
        "label": {
          "en": "Read the paper",
          "zh": "阅读论文"
        },
        "href": "https://doi.org/10.1109/TIM.2025.3643085"
      },
      {
        "label": {
          "en": "Source code",
          "zh": "项目代码"
        },
        "href": "https://github.com/untuitivist/PCASTNet"
      },
      {
        "label": {
          "en": "Publication record",
          "zh": "机构论文记录"
        },
        "href": "https://scholars.cityu.edu.hk/en/publications/pcastnet-a-physics-constrained-adaptive-style-transfer-network-fo/"
      }
    ]
  },
  "g1": {
    "category": {
      "en": "EMBODIED AI / REINFORCEMENT LEARNING",
      "zh": "具身智能 / 强化学习"
    },
    "title": {
      "en": "G1 motion retargeting",
      "zh": "G1 舞蹈动作迁移"
    },
    "summary": {
      "en": "An end-to-end workflow connecting dance video, human motion recovery, GMR retargeting, reinforcement learning, and robot execution.",
      "zh": "从舞蹈视频、人体动作恢复、GMR 动作重定向，到强化学习跟踪与机器人动作执行的完整工作流。"
    },
    "video": "images/projects/g1-motion.mp4",
    "image": "images/projects/g1-motion.webp",
    "alt": {
      "en": "Synchronized human motion recovery, retargeting, and simulated G1 motion tracking.",
      "zh": "人体动作恢复、重定向与 G1 仿真跟踪同步演示。"
    },
    "caption": {
      "en": "Synchronized human motion recovery, retargeting, and simulation.",
      "zh": "人体动作恢复、重定向与仿真跟踪同步演示。"
    },
    "work": {
      "en": "Recover motion from dance videos, retarget it to G1 with GMR, convert 29-joint motion sequences into 50 Hz references, and train whole-body tracking policies in mjlab.",
      "zh": "从舞蹈视频恢复人体动作，使用 GMR 重定向至 G1，将 29 关节动作序列转换为 50 Hz 参考运动数据，并在 mjlab 中训练全身运动跟踪策略。"
    },
    "result": {
      "en": "An end-to-end workflow from video input to robot execution, with sim-to-sim and sim-to-real validation.",
      "zh": "打通视频输入到真机动作执行的流程，完成 simu2simu 与 simu2real 验证。"
    },
    "links": [
      {
        "label": {
          "en": "Open original video",
          "zh": "打开原始视频"
        },
        "href": "images/projects/g1-motion.mp4"
      }
    ]
  },
  "tushare": {
    "category": {
      "en": "QUANT RESEARCH / DATA ENGINEERING",
      "zh": "量化研究 / 数据工程"
    },
    "title": {
      "en": "Tushare research platform",
      "zh": "Tushare 因子研究平台"
    },
    "summary": {
      "en": "A research platform for A-share data collection, factor evaluation, and portfolio backtesting, with a shared execution layer for people and agents.",
      "zh": "面向 A 股数据采集、因子评价和组合回测的研究平台，让 Agent CLI 与可视化 Web 共用一套执行逻辑。"
    },
    "image": "images/projects/tushare.webp",
    "alt": {
      "en": "Actual factor research interface with IC, RankIC, benchmark comparison and backtest panels.",
      "zh": "真实因子研究界面，包括 IC、RankIC、基准比较和回测面板。"
    },
    "caption": {
      "en": "Factor research workspace.",
      "zh": "因子研究工作台。"
    },
    "work": {
      "en": "Historical backfills, incremental updates, resumable collection, and data auditing. DuckDB queries and a visual workspace connect collection with factor evaluation and cost-aware, long-only portfolio backtesting.",
      "zh": "支持历史回填、增量更新、断点续采和数据审计；通过 DuckDB 查询与可视化工作台，连接数据采集、因子评价和含交易成本的多头组合回测。"
    },
    "result": {
      "en": "A working data-to-research pipeline with IC / RankIC evaluation and explicit Train / Valid / Test time splits. The CLI and Web use the same application services.",
      "zh": "形成可运行的数据到研究流程，支持 IC / RankIC 评价与明确的 Train / Valid / Test 时间切分；CLI 与 Web 调用同一套应用服务。"
    },
    "links": [
      {
        "label": {
          "en": "View the full interface",
          "zh": "查看完整界面"
        },
        "href": "images/projects/tushare.webp"
      }
    ]
  },
  "brain": {
    "category": {
      "en": "QUANT RESEARCH / AGENT-NATIVE TOOLS",
      "zh": "量化研究 / AGENT 原生工具"
    },
    "title": {
      "en": "WorldQuant BRAIN / wqb_cli",
      "zh": "WorldQuant BRAIN / wqb_cli"
    },
    "summary": {
      "en": "Factor research across regions, AI-assisted research workflows, and a command-line interface for WorldQuant BRAIN.",
      "zh": "面向不同 region 开展因子挖掘，参与 AI 辅助研究架构，并开发 WorldQuant BRAIN 命令行工具。"
    },
    "work": {
      "en": "Developed wqb_cli for BRAIN API access, alpha simulation and screening, with structured outputs suited to agent workflows. Contributed Selenium-based login and post retrieval to an MCP framework.",
      "zh": "开发 wqb_cli，支持 BRAIN API 调用、Alpha 回测与筛选，提供适合 Agent 工作流的结构化输出；为 MCP 框架贡献基于 Selenium 的登录与帖子获取。"
    },
    "result": {
      "en": "A publicly available command interface for API access, alpha simulation and screening, with structured outputs for repeatable research workflows.",
      "zh": "形成公开的命令接口，支持 API 调用、Alpha 回测与筛选，并以结构化输出支持可重复的研究流程。"
    },
    "links": [
      {
        "label": {
          "en": "Explore wqb_cli",
          "zh": "查看 wqb_cli"
        },
        "href": "https://github.com/untuitivist/wqb_cli"
      }
    ],
    "image": "images/projects/wqb-cli.jpg",
    "mediaLayout": "poster",
    "alt": {
      "en": "WQB CLI release poster: an agent-oriented command-line tool for research automation.",
      "zh": "WQB CLI 发布海报：面向 Agent 与研究自动化的命令行工具。"
    },
    "caption": {
      "en": "WQB CLI release poster.",
      "zh": "WQB CLI 发布海报。"
    }
  },
  "arm": {
    "category": {
      "en": "ROBOTICS / MOTION CONTROL",
      "zh": "机器人 / 运动控制"
    },
    "title": {
      "en": "Six-axis robotic arm",
      "zh": "六自由度串联机械臂"
    },
    "summary": {
      "en": "Mechanical design, kinematics and motion control for a compact six-degree-of-freedom serial robotic arm.",
      "zh": "围绕微型六自由度串联机械臂，开展结构设计、运动学建模与运动控制。"
    },
    "image": "images/projects/robot-arm.webp",
    "alt": {
      "en": "The six-axis robotic arm prototype moving through a joint-control sequence in the laboratory.",
      "zh": "六自由度串联机械臂样机在实验室中的关节运动演示。"
    },
    "caption": {
      "en": "Joint motion on the physical prototype.",
      "zh": "机械臂实物样机关节运动演示。"
    },
    "work": {
      "en": "Contributed to parts of the mechanical design and forward/inverse kinematics research. Used DH parameters and homogeneous transforms for forward kinematics, with pose separation and geometric/algebraic methods for inverse solutions.",
      "zh": "参与部分结构设计与正逆运动学研究。采用 DH 参数法与齐次变换建立正运动学模型，通过位姿分离及几何、代数方法求解逆运动学。"
    },
    "result": {
      "en": "The team delivered a working prototype and MATLAB interface for joint control, end-effector pose calculation, and synchronized 3D visualization. Kinematics were checked against simulation and measured prototype poses.",
      "zh": "项目完成样机与 MATLAB 上位机，实现关节控制、末端位姿解算和三维模型同步显示，并通过仿真与样机位姿对比验证运动学算法。"
    },
    "links": [
      {
        "label": {
          "en": "Open demo video",
          "zh": "打开演示视频"
        },
        "href": "images/projects/robot-arm.mp4"
      },
      {
        "label": {
          "en": "View the prototype",
          "zh": "查看样机照片"
        },
        "href": "images/projects/robot-arm.webp"
      }
    ],
    "video": "images/projects/robot-arm.mp4",
    "poster": "images/projects/robot-arm-video.webp"
  },
  "manhole": {
    "category": {
      "en": "COMPUTER VISION / URBAN INFRASTRUCTURE",
      "zh": "计算机视觉 / 城市基础设施"
    },
    "title": {
      "en": "Manhole hazard detection",
      "zh": "井盖隐患检测"
    },
    "summary": {
      "en": "Large-kernel convolutions and YOLOv10 for manhole hazard detection, connecting dataset construction with model development.",
      "zh": "将大卷积核与 YOLOv10 结合，用于井盖隐患检测，连接数据集制作与检测模型搭建。"
    },
    "image": "images/projects/manhole.webp",
    "alt": {
      "en": "RBC module showing RepLKBlock integrated with C2f.",
      "zh": "RBC 模块结构图，展示 RepLKBlock 与 C2f 的融合。"
    },
    "caption": {
      "en": "RBC module from the project paper. RepLKBlock introduces large kernels into the C2f structure.",
      "zh": "项目论文中的 RBC 模块，使用 RepLKBlock 将大卷积核引入 C2f 结构。"
    },
    "work": {
      "en": "Contributed to the manhole detection dataset and model development. Integrated RepLKBlock with C2f in YOLOv10 to construct LK-YOLO.",
      "zh": "参与井盖检测数据集制作与检测模型搭建，基于 YOLOv10 引入 RepLKBlock 大卷积核，并与 C2f 融合构建 LK-YOLO。"
    },
    "result": {
      "en": "The project integrates large-kernel convolutions into YOLOv10. The related paper was published in Software, 2025, 46(5): 4–7.",
      "zh": "项目将大卷积核引入 YOLOv10，相关论文发表于《软件》，2025，46(5)：4–7。"
    },
    "links": [
      {
        "label": {
          "en": "Read the paper",
          "zh": "阅读论文"
        },
        "href": "https://software.publish.founderss.cn/thesisDetails?columnId=115985918&Fpath=home&index=0&lang=zh"
      }
    ]
  }
};
