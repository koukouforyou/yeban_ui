import { Component, ElementRef, Injector, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { HumanDto, HumanRelationCreateDto, HumanRelationDto, HumanRelationLinkDto, HumanRelationNodeDto, HumanRelationServiceProxy, HumanServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { BindHumanrelationModalComponent } from '../bind-humanrelation-modal/bind-humanrelation-modal.component';
import { CreateHumanModalComponent } from '../../humans/create-human-modal/create-human-modal.component';
import * as SvgAsPng from 'save-svg-as-png';
import ResizeObserver from 'resize-observer-polyfill';
import { ContextMenu, ContextMenuModule, LazyLoadEvent, MenuItem } from 'primeng/primeng';
import { HumanViewContentmenuComponent } from './human-view-contentmenu/human-view-contentmenu.component';
import { EditHumanModalComponent } from '../../humans/edit-human-modal/edit-human-modal.component';
import { EditHumanHeadpicModalComponent } from '../../humans/edit-human-modal/edit-human-headpic-modal/edit-human-headpic-modal.component';
import { EditHumanProjectMapModalComponent } from '../humanrelationlist/edit-human-project-map-modal/edit-human-project-map-modal.component';

@Component({
    selector: 'app-humanview',
    templateUrl: './humanview.component.html',
    styleUrls: ['./humanview.component.css'],
    animations: [appModuleAnimation()],
})
export class HumanviewComponent extends AppComponentBase implements OnInit {

    public contextmenuitem:string;
    public searchKey: string;
    public Width = 100;
    public Height;
    public circleRadius = 30;
    public circleDistinct = 80;
    public display;
    public IsMajor = true;
    private svg;
    private humannodes: HumanRelationNodeDto[];
    private humanlinks: HumanRelationLinkDto[];

    private sourceHumannode: HumanRelationNodeDto;
    private destHumannode: HumanRelationNodeDto;
    private clickNum = 0;
    private g;
    private nodesData;
    private linksData;

    private nodes;
    private links;
    private markers;
    private markers2;
    private nodes_text;
    private nodes_img;
    private links_text;

    private gNodes;
    private gNodes_text;
    private gLinks;
    private gLinks_text;
    private gNodes_img;
    private gMarker;
    private gMarker2;
    private gTitle;
    private interNodeId;
    private simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>;


    public items: MenuItem[];

    @ViewChild('contextMenuModule',{read:ContextMenu,static:false}) contextMenuModule:ContextMenu;
    @ViewChild('editHumanHeadpicModalComponent', { read: EditHumanHeadpicModalComponent, static: false }) editHumanHeadpicModalComponent: EditHumanHeadpicModalComponent;
    @ViewChild('bindHumanrelationModalComponent', { read: BindHumanrelationModalComponent, static: false }) bindHumanrelationModalComponent: BindHumanrelationModalComponent;
    @ViewChild('createHumanModalComponent', { read: CreateHumanModalComponent, static: false }) createHumanModalComponent: CreateHumanModalComponent;
    @ViewChild('editHumanProjectMapModalComponent',{read:EditHumanProjectMapModalComponent,static:false}) editHumanProjectMapModalComponent:EditHumanProjectMapModalComponent
    @ViewChild('editHumanModalComponent', { read: EditHumanModalComponent, static: false }) editHumanModalComponent: EditHumanModalComponent;
    @ViewChild('maindiv', { static: true }) element: ElementRef;
    @ViewChild('humanViewSettingModal', { static: false }) humanViewSettingModal;
    constructor(injector: Injector, private _humanServiceProxy: HumanServiceProxy, private _humanRelationServiceProxy: HumanRelationServiceProxy, private renderer: Renderer2) {
        super(injector);
    }

    installationMode: boolean;

    ngOnInit() {
        document.oncontextmenu = function () {return false; };
        document.onkeydown = function(event){
            if(event.ctrlKey&&event.key=="f")
            {
                document.getElementById('SearchKey').focus();
                return false;
            }
        }
        this.show();

        this.items = this.initContextItem();
    }

    ngOnDestroy(){
        document.oncontextmenu = function () {return true; };
        document.onkeydown = function(){
            return true;
        }
    }

    ngAfterViewInit() {
        var objResizeObserver = new ResizeObserver(() => { this.createSvg(); });
        objResizeObserver.observe(this.element.nativeElement);
    }

    changeSize(width: string, height: string) {
        this.renderer.setStyle(this.element.nativeElement, 'width', width);
        this.renderer.setStyle(this.element.nativeElement, 'height', height);
    }

    saveToPng() {
        this.convertToPng();
    }

    convertToPng() {
        SvgAsPng.saveSvgAsPng(this.svg.node(), 'svg.png', { scale: 2, backgroundColor: "#ffffff", encoderOptions: 1.0 });
    }

    show(): void {
        this._humanRelationServiceProxy.getAllLinks(this.IsMajor).subscribe(result => {
            this.humanlinks = result;
            this._humanServiceProxy.getAllNodes(this.IsMajor).subscribe(result2 => {
                this.humannodes = result2;
                this.createSvg();
                this.drawBars();
            })
        });
    }

    createSvg(): void {
        this.Height = this.element.nativeElement.offsetHeight;

        if (this.svg == undefined) {
            this.svg = d3.select("figure#bar")
                .append("svg")
                .attr("viwBox", -this.element.nativeElement.offsetWidth / 2 + "," + -this.element.nativeElement.offsetHeight / 2 + "," + this.element.nativeElement.offsetWidth + "," + this.element.nativeElement.offsetHeight)
                .attr("width", "100%")
                .attr("height", this.Height)
                .call(d3.zoom().extent([[0, 0], [this.element.nativeElement.offsetWidth, this.element.nativeElement.offsetHeight]])
                    .scaleExtent([0.2, 8]).on("zoom", (event) => {
                        this.g.attr("transform", event.transform)
                    }))
                ;
            this.g = this.svg.append("g");
        }
        else {
            this.svg.attr("viwBox", -this.element.nativeElement.offsetWidth / 2 + "," + -this.element.nativeElement.offsetHeight / 2 + "," + this.element.nativeElement.offsetWidth + "," + this.element.nativeElement.offsetHeight)
                .attr("width", "100%")
                .attr("height", this.element.nativeElement.offsetHeight)
                .call(d3.zoom().extent([[0, 0], [this.element.nativeElement.offsetWidth, this.element.nativeElement.offsetHeight]])
                    .scaleExtent([0.2, 8]).on("zoom", (event) => {
                        this.g.attr("transform", event.transform)
                    }))
                ;
        }
    }

    drag = simulation => {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    private drawBars(): void {
        this.initData();
        this.simulation = d3.forceSimulation(this.nodesData);
        this.simulation.force('link', d3.forceLink(this.linksData).id((d: any) => d.id)
            .strength(2)
            .distance((this.humanlinks.length / this.humannodes.length) * 200)
        );
        this.simulation.force('center', d3.forceCenter(this.element.nativeElement.offsetWidth / 2, this.element.nativeElement.offsetHeight / 2));
        this.simulation.force('charge', d3.forceManyBody().strength(0.01));
         this.simulation.force('collide', d3.forceCollide().radius(this.circleDistinct).iterations(0.01));
         this.simulation.force("x", d3.forceX(this.element.nativeElement.offsetWidth / 2).strength(0.01));
        this.simulation.force("y", d3.forceY(this.element.nativeElement.offsetHeight / 2).strength(0.1));
        this.simulation.on("tick", () => {
            this.links
                .attr("x1", (d: { source: { x: any; }; }) => d.source.x)
                .attr("y1", (d: { source: { y: any; }; }) => d.source.y)
                .attr("x2", (d: { target: { x: any; }; }) => d.target.x)
                .attr("y2", (d: { target: { y: any; }; }) => d.target.y)
                .attr("marker-end", "url(#markerEnd)")
                .attr("marker-start", function (d) { return d.isTwoWay ? "url(#markerStart)" : "" });
            this.nodes
                .attr("cx", (d: { x: any; }) => d.x)
                .attr("cy", (d: { y: any; }) => d.y);

            this.links_text.attr("x", function (d) { return (d.source.x + d.target.x) / 2; });
            this.links_text.attr("y", function (d) { return (d.source.y + d.target.y) / 2; });
            this.nodes_text.attr("x", function (d) { return d.x });
            this.nodes_text.attr("y", function (d) { return d.y + 5 });
        });
        this.initNodeText(this.nodesData);
        this.initLinks(this.linksData);
        this.initMarkers();
        this.initLinksText(this.linksData);
        this.initNodesImg(this.nodesData);
        this.initNodes(this.nodesData);
        this.searchHuman();
        //this.CreateNodeTitle();
    }

    //初始化数据
    private initData(): void {
        this.linksData = this.humanlinks.map(d => Object.create(d));
        this.nodesData = this.humannodes.map(d => Object.create(d));
    }

    //初始化节点
    private initNodes(nodesData) {
        if (this.gNodes == undefined) {
            this.gNodes = this.g.append("g");
        }
        this.nodes = this.gNodes
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodesData)
            .join("circle")
            .attr("r", this.circleRadius)
            .attr("class", "node")
            .style('opacity', (d, i) => d.headPic != "" ? 1 : 0.5)
            .style('cursor', 'pointer')
            .attr("fill", (d, i) => d.headPic != "" ? "url(#catpattern" + i + ")" : d.id == this.interNodeId ? "yellow" : "gray")
            .on("click", (event, d) => {
                if (this.sourceHumannode == undefined) {
                    this.sourceHumannode = this.humannodes[d.index];
                    this.gNodes.selectAll("circle").attr("stroke",(e)=>(e.index==d.index?"#f0f":(e.name.indexOf(this.searchKey)!=-1&&this.searchKey!="")?"#f00":"#fff"));
                    this.notify.info("源：{" + this.sourceHumannode.name + "}");
                }
                else {
                    if (this.sourceHumannode == this.humannodes[d.index]) {
                        this.sourceHumannode = this.humannodes[d.index];
                        this.notify.info("源：{" + this.sourceHumannode.name + "}");
                    }
                    else {
                        this.destHumannode = this.humannodes[d.index];
                        this.bindHumanrelationModalComponent.show(this.sourceHumannode.id, this.destHumannode.id, this.sourceHumannode.name, this.destHumannode.name);
                        this.sourceHumannode = undefined;
                        this.destHumannode = undefined;
                        this.gNodes.selectAll("circle").attr("stroke","#fff");
                        this.searchHuman();
                    }
                }
            })
            .on("contextmenu",(event,d)=>{
                this.contextmenuitem = d.id;
                this.contextMenuModule.show(event);
            })
            .call(this.drag(this.simulation));
        this.nodes.selectAll("title").remove();
        this.nodes.append("title").text((d, i) => d.name);
    }

    //初始化节点信息
    private initNodeText(nodesData) {
        if (this.gNodes_text == undefined) {
            this.gNodes_text = this.g.append("g");
        }
        this.gNodes_text.selectAll("text").remove();
        this.nodes_text = this.gNodes_text
            .selectAll("text")
            .data(nodesData)
            .enter()
            .append("text")
            .attr("fill", "black")
            .attr("font-size", d => d.headPic == "" || d.headPic == undefined ? this.circleRadius / 3 : this.circleRadius / 3)
            .attr("text-anchor", "middle")
            //.attr("class", "unseleted")
            .attr("dx", d => d.headPic == "" || d.headPic == undefined ? 0 : this.circleRadius / 12)
            .attr("dy", d => d.headPic == "" || d.headPic == undefined ? 0 : this.circleRadius + this.circleRadius / 3)
            .text(d => d.headPic == "" || d.headPic == undefined ? d.name : d.name);
    }

    //初始化节点图片
    private initNodesImg(nodesData) {
        if (this.gNodes_img == undefined) {
            this.gNodes_img = this.g.append("g");
        }
        this.gNodes_img.selectAll("defs").remove();
        this.nodes_img = this.gNodes_img
            .selectAll("defs")
            .data(nodesData).enter()
            .append("defs")
            .attr("id", "imgdefs")
            .append("pattern")
            .attr("id", (d, i) => "catpattern" + i)
            .attr("height", 1)
            .attr("width", 1)
            .append("image")
            .attr("x", 5)
            .attr("y", 5)
            .attr("width", this.circleRadius * 2 - 10)
            .attr("height", this.circleRadius * 2 - 10)
            .attr("xlink:href", (d, i) => d.headPic)
    }

    //初始化链接
    private initLinks(linksData) {
        if (this.gLinks == undefined) {
            this.gLinks = this.g.append("g");
        }
        this.gLinks.selectAll("line").remove();
        this.links = this.gLinks
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(linksData)
            .join("line")
            .attr("class", "line")
            .attr("stroke-width", (d: { value: number; }) => Math.sqrt(d.value))
            .style('cursor', 'crosshair')
            .on("click", (event, d) => {
                console.log("index", d.index);
                console.log("length", this.humanlinks.length);
                this.message.confirm(
                    this.l('UserDeleteWarningMessage', this.humanlinks[d.index].id),
                    this.l('AreYouSure'), (isConfirmed) => {
                        if (isConfirmed) {
                            console.log(this.humanlinks[d.index]);
                            this._humanRelationServiceProxy.delete(this.humanlinks[d.index].id)
                                .subscribe(() => {
                                    this.humanlinks.splice(d.index, 1);
                                    console.log(this.humanlinks);
                                    this.Update();
                                    this.notify.success(this.l('SuccessfullyDeleted'));
                                });
                        }
                    }
                )
            });
    }

    //初始化链接文字
    private initLinksText(linksData) {
        if (this.gLinks_text == undefined) {
            this.gLinks_text = this.g.append("g");
        }
        this.gLinks_text
            .selectAll("text").remove();
        this.links_text = this.gLinks_text
            .selectAll("text")
            .data(linksData).enter()
            .append("text")
            .attr("font-size", "8px")
            .text(d => d.description)
    }

    //初始化箭头
    private initMarkers() {
        if (this.gMarker == undefined) {
            this.gMarker = this.g.append("g");
        }
        this.gMarker.selectAll("marker").remove();
        this.markers =
            this.gMarker.append("marker")
                .attr("id", "markerEnd")
                .attr("markerUnits", "userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10") //坐标系的区域
                .attr("refX", 72) //箭头坐标
                .attr("refY", 0)
                .attr("markerWidth", 5) //标识的大小
                .attr("markerHeight", 5)
                .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
                .attr("stroke-width", 2) //箭头宽度
                .append("path")
                .attr("d", "M0,-5L10,0L0,5") //箭头的路径
                .attr('fill', '#000000'); //箭头颜色


        if (this.gMarker2 == undefined) {
            this.gMarker2 = this.g.append("g");
        }
        this.gMarker2.selectAll("marker").remove();
        this.markers2 =
            this.gMarker2.append("marker")
                .attr("id", "markerStart")
                .attr("markerUnits", "userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10") //坐标系的区域
                .attr("refX", -62) //箭头坐标
                .attr("refY", 0)
                .attr("markerWidth", 5) //标识的大小
                .attr("markerHeight", 5)
                .attr("orient", "auto") //绘制方向，可设定为：auto（自动确认方向）和 角度值
                .attr("stroke-width", 2) //箭头宽度
                .append("path")
                .attr("d", "M0,0L10,-5L10,5Z") //箭头的路径
                .attr('fill', '#000000'); //箭头颜色
    }

    //查询
    searchHuman(event?: LazyLoadEvent) {
        this.gNodes.selectAll("circle").attr("stroke", (d) => (d.name.indexOf(this.searchKey) != -1 && this.searchKey != "" ? "#f00" : "#fff")||(d.nickName.indexOf(this.searchKey) != -1 && this.searchKey != "" ? "#f00" : "#fff"));
        this.gNodes.selectAll("circle").attr("stroke-width", (d) => (d.name.indexOf(this.searchKey) != -1 && this.searchKey != "" ? 10 : 1.5)||(d.nickName.indexOf(this.searchKey) != -1 && this.searchKey != "" ? 10 : 1.5));
    }

    //添加链接
    appendLink(info: HumanRelationDto): void {
        var humaninfo = new HumanRelationLinkDto();
        humaninfo.source = info.sourceHumanId;
        humaninfo.sourceName = info.sourceHumanId;
        humaninfo.description = info.description;
        humaninfo.id = info.id;
        humaninfo.target = info.destHumanId;
        humaninfo.targetName = info.destHumanId;
        humaninfo.isTwoWay = info.isTwoWay;
        this.humanlinks.push(humaninfo);
        this.Update();
    }

    //添加节点
    appendNode(info: HumanDto): void {
        var humannode = new HumanRelationNodeDto();
        humannode.id = info.id,
            humannode.group = 1,
            humannode.headPic = "",
            humannode.name = info.name,
            this.humannodes.push(humannode);
        this.interNodeId = info.id;
        this.Update();
    }

    //更新方法
    private Update() {
        this.initData();
        this.links = this.gLinks.data(this.linksData);
        this.drawBars();
        this.simulation.alpha(0.3).restart();
        this.searchHuman();
    }


    createHuman() {
        this.createHumanModalComponent.show();
    }


    //#region 更新图形形状
    public UpdateNodes() {
        this.gNodes.selectAll("circle").attr("r", this.circleRadius);
        this.gNodes_img.selectAll("image")
            .attr("width", this.circleRadius * 2 - 10 > 5 ? this.circleRadius * 2 - 10 : 5)
            .attr("height", this.circleRadius * 2 - 10 > 5 ? this.circleRadius * 2 - 10 : 5);
        this.gNodes_text.selectAll("text")
            .attr("font-size", d => d.headPic == "" || d.headPic == undefined ? this.circleRadius / 3 : this.circleRadius / 3)
            .attr("dx", d => d.headPic == "" || d.headPic == undefined ? 0 : this.circleRadius / 24)
            .attr("dy", d => d.headPic == "" || d.headPic == undefined ? 0 : this.circleRadius + this.circleRadius / 3);
    }

    public UpdateLink() {
        this.simulation.force('collide', d3.forceCollide().radius(this.circleDistinct).iterations(5));
        this.simulation.alpha(0.3).restart();
    }

    public getMenu():any[]{
        let menu = [
            {
                title: 'Toggle dark theme',
                action: function (data, event) {
                    alert(data);
                }
            }]
            return menu;
    }

    private initContextItem():any[]{
        let items = [
            {
                label: this.l('Edit'),
                icon:'pi pi-fw pi-pencil',
                command:(event)=>{
                    this.editHumanModalComponent.show(this.contextmenuitem);
                }
            },
            {
                label: this.l('Picture'),
                icon: 'pi pi-fw pi-image',
                command:(event)=>{
                    this.editHumanHeadpicModalComponent.show(this.contextmenuitem);
                }
            },
            {
                label: this.l('Delete'),
                icon: 'pi pi-fw pi-trash',
                command:(event)=>{
                    this.deleteHuman(this.contextmenuitem);
                }
            }
            // ,
            // {
            //     label: 'Delete',
            //     icon: 'pi pi-fw pi-trash',
            //     items: [
            //         {label: 'Delete', icon: 'pi pi-fw pi-trash'},
            //         {label: 'Refresh', icon: 'pi pi-fw pi-refresh'}
            //     ]
            // }
        ];
        return items;
    }

    deleteHuman(id: string): void {
        this.message.confirm(
            this.l('UserDeleteWarningMessage', id),
            this.l('AreYouSure'), (isConfirmed) => {
                if (isConfirmed) {
                    this._humanServiceProxy.delete(id)
                        .subscribe(() => {
                            this.show();
                            this.notify.success(this.l('SuccessfullyDeleted'));
                        });
                }
            }
        );
        this.Update();
    }

    projectMap(){
        this.editHumanProjectMapModalComponent.show();
    }

    public ItemAction(action:string){
        if(action=="edit")
        {
            this.editHumanModalComponent.show(this.contextmenuitem);
        }
    }
    //#endregion
}


