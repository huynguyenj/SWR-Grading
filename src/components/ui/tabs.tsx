export interface TabItem {
  id: string
  label: string
}

interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (id: string) => void
}

/**
 * Tabs dùng chung — chỉ render phần header (các nút tab), nội dung từng tab
 * do component gọi tự quyết định render bên ngoài dựa vào `activeTab`.
 *
 * ```tsx
 * const [activeTab, setActiveTab] = useState('tab1')
 * <Tabs tabs={[{id:'tab1', label:'Tab 1'}, {id:'tab2', label:'Tab 2'}]}
 *       activeTab={activeTab} onChange={setActiveTab} />
 * {activeTab === 'tab1' && <Tab1Content />}
 * {activeTab === 'tab2' && <Tab2Content />}
 * ```
 */
export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="border-b border-border-default">
      <div className="flex gap-1 -mb-px">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={[
                'relative px-4 py-2.5 text-sm font-medium transition-colors border-b-2',
                isActive
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-text-secondary hover:text-text-primary',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}